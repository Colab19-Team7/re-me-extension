console.info("chrome-ext re-me background script");

// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, function (tab) {
//     const { url, title } = tab;
//     if (tab.status === "complete" && tab.active && tab.id) {
//       console.log("you are here: " + url);
//       chrome.tabs.sendMessage(tab.id, { url, title, from: "onActivated" });
//     }
//   });
// });

// chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
//   if (change.status === "complete" && tab.active && tab.id) {
//     const { url, title } = tab;
//     try {
//       const response = chrome.tabs.sendMessage(tab.id, {
//         url,
//         title,
//         from: "onUpdated",
//       });
//     } catch (err) {
//       console.log(err);
//     }
//     console.log("you are here: " + tab.url);
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("background script received message", request, sender);
//   sendResponse(request);
//   return true;
// });

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "https://re-me.netlify.app/",
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, onSuccess) {
  switch (request.action) {
    case "AUTH_CHECK":
      console.log("running auth check");

      fetch("http://localhost:3000/api/auth/session", {
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          onSuccess(res);
        })
        .catch((err) => {
          console.log(err);
          onSuccess({ error: err });
        });

      return true;

    case "SAVE_LINK":
      console.log("running save link");
      const { data } = request;

      fetch("https://re-me-api.onrender.com/api/v1/items", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          link: data.url,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          onSuccess(res);
        })
        .catch((err) => {
          console.log(err);
          onSuccess({ error: err });
        });

      return true;

    default:
      break;
  }
});

export {};
