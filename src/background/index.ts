console.info("chrome-ext template-react-ts background script");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("background script received message", request, sender);
  // chrome.storage.local.set({ "photo-data": request }, function () {});
  sendResponse(request);
  return true;
});

export {};
