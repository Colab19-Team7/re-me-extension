console.info("chrome-ext re-me content script");

(async () => {
  // const response = await chrome.runtime.sendMessage({
  //   payload: {
  //     message: "Data from Web page",
  //   },
  // });
  // // listen for messages from the background script
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log("content script received message", request, sender);
  //   // chrome.storage.local.set({ "photo-data": request }, function () {});
  //   sendResponse(request);
  //   return true;
  // });
})();

export {};
