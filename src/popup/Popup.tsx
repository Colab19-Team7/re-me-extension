import { useEffect, useState } from "react";
import { getOGImage } from "../utils/getOgImg";

function App() {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>();
  const [ogImg, setOgImg] = useState<string | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs[0]);
      setTab(tabs[0]);
      if (tabs[0].url) {
        getOGImage(tabs[0].url).then((res) => {
          console.log(res);
          setOgImg(res);
        });
      }
    });
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
          src={ogImg ?? tab?.favIconUrl}
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

      {/* <select className="w-full bg-[#878787] h-8">
        <option>Reminder Me</option>
        <option>Reminder Me</option>
        <option>Reminder Me</option>
        <option>Reminder Me</option>
      </select> */}
    </main>
  );
}

export default App;
