import { CurrentTab } from "../types";
import { getOGImage } from "./getOgImg";

export async function getCurrentTab() {
  try {
    const data: CurrentTab = {};

    let queryOptions = { active: true, currentWindow: true };

    let [tab] = await chrome.tabs.query(queryOptions);

    if (tab.url && tab.url.startsWith("http")) {
      const imgUrl = await getOGImage(tab.url);

      if (imgUrl) {
        data.image = imgUrl;
      }
    }

    return {
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl, // fallback to default icon if no OG image
      ...data,
    };
  } catch (error) {
    console.log(error);
  }
}
