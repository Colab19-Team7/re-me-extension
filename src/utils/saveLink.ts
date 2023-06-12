import { CurrentTab } from "../types";

export const saveLink = async (data: CurrentTab & { token: string }) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "SAVE_LINK", data }, (response) => {
      if (response.error) {
        reject(response);
      } else {
        resolve(response);
      }
    });
  });
};
