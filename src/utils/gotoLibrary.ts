export const gotoLibrary = (path?: string) => {
  const url = path ? `https://re-me.onrender.com/${path}` : "https://re-me.onrender.com";
  chrome.tabs.create({
    url,
  });
};
