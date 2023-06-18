console.info("chrome-ext re-me background script");
import { NotificationMessage } from "../types";
let notificationMessage:NotificationMessage;

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "https://re-me.onrender.com/",
    });
  }
});

const createAlarm = (data:NotificationMessage) => {
  chrome.storage.session.set({notificationMessage: data})
  notificationMessage = data

  chrome.alarms.create(
    're-me_reminder',
    {
      periodInMinutes: 1
    }
  )
  console.info("Alarms set")
}

chrome.alarms.onAlarm.addListener(() => {
  chrome.notifications.create('', notificationMessage.message, () => {})
  console.info("Notification sent")
})

chrome.notifications.onClicked.addListener(() => {
  chrome.alarms.clear('re-me_reminder')
  chrome.tabs.create({ url: notificationMessage.item_url })
  console.info("Clear notification")
})

chrome.notifications.onClosed.addListener(() => {
  chrome.alarms.clear('re-me_reminder')
  console.info("Clear notication")
})

chrome.runtime.onMessage.addListener(async function (request, sender, onSuccess) {
  switch (request.action) {
    case "AUTH_CHECK":
      console.log("running auth check");

      // fetch("http://localhost:3000/api/auth/session", {
      //   mode: "cors",
      // })
      fetch("https://re-me.onrender.com/api/auth/session")
        .then((res) => res.json())
        .then((res) => {
          onSuccess(res);
          console.log("auth check success");
        })
        .catch((err) => {
          console.log(err, "auth check failed");
          onSuccess({ error: err });
        });

      return true;

    case "SAVE_LINK":
      console.log("running save link");
      const { data } = request;

      fetch("https://re-me-api.onrender.com/api/v1/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          link: data.url,
          item_image: data.image,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          onSuccess(res);
          console.log("save link success");
        })
        .catch((err) => {
          console.log(err);
          onSuccess({ error: err });
        });

      return true;

    case "REMOVE_LINK":
      console.log("running remove link");
      const { id, token } = request.data;

      fetch(`https://re-me-api.onrender.com/api/v1/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          onSuccess({ success: true });
          console.log("remove link success");
        })
        .catch((err) => {
          console.log(err);
          onSuccess({ error: err });
        });

      return true;

    case "NOTIFICATION":
      chrome.alarms.clear('re-me_reminder')
      createAlarm(request.data)
      break

    default:
      break;
  }
});

console.info("Running createSocket")

export { };
