import { useEffect, useState } from "react";
import { getOGImage } from "../utils/getOgImg";

async function getCurrentTab() {
  try {
    const data: {
      image?: string | null;
      title?: string;
      url?: string;
    } = {};

    let queryOptions = { active: true, currentWindow: true };

    let [tab] = await chrome.tabs.query(queryOptions);

    if (tab.url) {
      const imgUrl = await getOGImage(tab.url);
      data.image = imgUrl;
    }

    return {
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl,
      ...data,
    };
  } catch (error) {
    console.log(error);
  }
}

const saveLink = (data) => {
  chrome.runtime.sendMessage({ action: "SAVE_LINK", data }, (response) => {
    console.log(response);
  });
};

function App() {
  const [tab, setTab] = useState<{
    image?: string | null;
    title?: string;
    url?: string;
    favIconUrl?: string;
  } | null>();
  const [auth, setAuth] = useState<{}>();

  const init = async () => {
    const currentTab = await getCurrentTab();

    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, (data) => {
      const { session, authenticated } = data;
      if (!authenticated) {
        return chrome.tabs.create({
          url: "http://localhost:3000/signin",
        });
      }

      setAuth(session);

      setTab(currentTab);

      saveLink({
        ...currentTab,
        token: session.user.token,
      });
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <main className="bg-white space-y-2">
      <div className="flex justify-between">
        <p className="">Saved to RE-ME</p>

        <button className="uppercase" onClick={() => {}}>
          Remove
        </button>
      </div>

      <div className="flex gap-4">
        <img
          src={tab?.image ?? tab?.favIconUrl}
          alt={tab?.title}
          className="h-16 w-20 border bg-[#878787] object-cover flex-1"
        />

        <div className="flex flex-col justify-center flex-2 overflow-hidden ">
          <div className="truncate">{tab?.title}</div>
          <a href="#" className="underline truncate">
            {tab?.url}
          </a>
        </div>
      </div>
    </main>
  );
}

export default App;
