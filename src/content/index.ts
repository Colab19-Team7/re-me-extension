console.info("chrome-ext template-react-ts content script");

(async () => {
  const response = await chrome.runtime.sendMessage({
    payload: {
      message: "Data from Web page",
    },
  });
  // do something with response here, not outside the function
})();

export {};
