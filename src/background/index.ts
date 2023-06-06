console.info("chrome-ext re-me background script");

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({
      url: "https://re-me.onrender.com/",
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, onSuccess) {
  switch (request.action) {
    case "AUTH_CHECK":
      console.log("running auth check");

      fetch("https://re-me.onrender.com/api/auth/session", {
        mode: "cors",
      })
        .then((res) => res.json())
        .then((res) => {
          onSuccess(res);
          console.log("auth check success");
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

    default:
      break;
  }
});

export {};
