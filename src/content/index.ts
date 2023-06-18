// console.info("chrome-ext re-me content script");
console.log("Chrome extension go out side");
import Logo from "../assets/re-me.png"
import { NotificationMessage } from "../types";
(async () => {
  // const response = await chrome.runtime.sendMessage({
  //   payload: {
  //     message: "Data from Web page",
  //   },
  // });

  chrome.runtime.sendMessage({action: "AUTH_CHECK"}, (data) => {
    const {authenticated, user } = data;

    console.log(user.id);
    createSocket(2);
  })
  
  console.log("Chrome extension go in")
  const createSocket = (user_id:number) => {
    const socket_url = 'ws://localhost:3000/cable';
    const ws_token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.Vm8fLva7_5uljYSfLcBW0olGixtjwD4cjGSuYL-pFPg'
    const socket = new WebSocket(socket_url);

    // When the socket is opened, we can send data to the server
    socket.onopen = function (event) {
      console.log("Connected to server");

      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'NotificationChannel',
          user_id: user_id
        })
      };

      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = function (event) {
      const { message, type } = JSON.parse(event.data)
      const alertTime = (new Date).toLocaleTimeString().replace(/:\d{2}\s/, ' ')
      // console.log("Received data from server", event.data)
      if (type === 'ping') return
      if (type === 'welcome') return

      if (message) {
        const item = JSON.parse(message)
        const demoNotificationOptions = {
          message: {
            type: "basic",
            title: alertTime,
            message: item.title,
            iconUrl: Logo,
            silent: false
          },
          item_url: item.item_link
        } as NotificationMessage
        chrome.runtime.sendMessage({ action: 'NOTIFICATION', data: demoNotificationOptions })
      }
    }

    socket.onclose = function (event) {
      console.log("Disconnected from server");
      setTimeout(() => { createSocket(2) }, 5000);
    }

    socket.onerror = function (error) {
      console.log("WebSocket error observed: ", error)
    }
  }
  // // listen for messages from the background script
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log("content script received message", request, sender);
  //   // chrome.storage.local.set({ "photo-data": request }, function () {});
  //   sendResponse(request);
  //   return true;
  // });
})();

export { };
