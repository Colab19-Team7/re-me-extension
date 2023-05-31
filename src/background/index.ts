console.info("chrome-ext template-react-ts background script");

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    const y = tab.url;
    if (tab.status === "complete" && tab.active && tab.id) {
      console.log("you are here: " + y);
      chrome.tabs.sendMessage(tab.id, { url: y, title: tab.title });
    }
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  console.log({ tabId, change, tab });

  if (tab.active && change.url && tab.status === "complete") {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        url: tab.url,
        title: tab.title,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    console.log("you are here: " + tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background script received message", request, sender);
  // chrome.storage.local.set({ "photo-data": request }, function () {});
  sendResponse(request);
  return true;
});

export {};
