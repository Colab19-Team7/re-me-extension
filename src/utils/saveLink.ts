import { CurrentTab } from "../types";

export const saveLink = (data: CurrentTab & { token: string }) => {
  chrome.runtime.sendMessage({ action: "SAVE_LINK", data }, (response) => {
    console.log(response);
  });
};
