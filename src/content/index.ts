import Logo from "../assets/re-me.png";
import { NotificationMessage } from "../types";

(() => {
  chrome.storage.local.get(["currentUser"], ({ currentUser }) => {
    if (currentUser) {
      createSocket(currentUser.id);
    } else {
      chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, (data) => {
        const { authenticated, user } = data;

        chrome.storage.local.set({ currentUser: user });
        createSocket(user.id);
      });
    }
  });

  const createSocket = (user_id: number) => {
    const socket_url = "wss://re-me-api.onrender.com/cable";
    let checkServer = true;
    const socket = new WebSocket(socket_url);

    // When the socket is opened, we can send data to the server
    socket.onopen = function (event) {
      const msg = {
        command: "subscribe",
        identifier: JSON.stringify({
          channel: "NotificationChannel",
          user_id: user_id,
        }),
      };

      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = function (event) {
      const { message, type } = JSON.parse(event.data);
      const alertTime = new Date().toLocaleTimeString().replace(/:\d{2}\s/, " ");
      // console.log("Received data from server", event.data)
      if (type === "ping") return;
      if (type === "welcome") return;

      if (message) {
        const item = JSON.parse(message);
        const demoNotificationOptions = {
          message: {
            type: "basic",
            title: alertTime,
            message: item.title,
            iconUrl: Logo,
            silent: false,
          },
          item_url: item.item_link,
        } as NotificationMessage;
        chrome.runtime.sendMessage({ action: "NOTIFICATION", data: demoNotificationOptions });
      }

      checkServer = false;
    };

    socket.onclose = function (event) {
      checkServer = true;
      setTimeout(() => {
        createSocket(user_id);
      }, 50000);
    };

    socket.onerror = function (error) {
      // console.log("WebSocket error observed: ", error)
    };
  };
})();

export {};
