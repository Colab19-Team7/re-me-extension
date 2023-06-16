import { Check, List } from "lucide-react";
import { useEffect, useState } from "react";
import { CurrentTab } from "../types";
import { getCurrentTab, saveLink } from "../utils";

function App() {
  const [tab, setTab] = useState<CurrentTab | null>();
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gotoLibrary = (path?: string) => {
    const url = path ? `https://re-me.onrender.com/${path}` : "https://re-me.onrender.com";
    chrome.tabs.create({
      url,
    });
  };

  const init = async () => {
    setLoading(true);
    const currentTab = await getCurrentTab();

    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, async (data) => {
      const { user, authenticated } = data;

      // check auth status and redirect to signin page if not authenticated
      if (!authenticated) return gotoLibrary("signin");

      // save the link to the re-me library
      const res = (await saveLink({
        ...currentTab,
        token: user.token,
      })) as any;

      console.log(res);

      if ("errors" in res) {
        res.errors.includes("limit")
          ? setError("You have reached the limit of 6 links.")
          : setError("Something went wrong. Please try again later.");
        setLoading(false);
        return;
      }

      setTab(currentTab);
      setLoading(false);
    });
  };

  useEffect(() => {
    init();

    const socket_url = 'wss://re-me-api.onrender.com/cable';
    const ws_token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.Vm8fLva7_5uljYSfLcBW0olGixtjwD4cjGSuYL-pFPg'
    const socket = new WebSocket(socket_url, ws_token);

    // When the socket is opened, we can send data to the server
    socket.onopen = function (event) {
      console.log("Connected to server");

      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'NotificationChannel',
          user_id: 2
        })
      };

      socket.send(JSON.stringify(msg));
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data)
      // console.log("Received data from server", event.data)
      if (data.type === 'ping') return
      if (data.type === 'welcome') return

      if (data.message) {
        console.log(data.message)
      }
    }

    socket.onclose = function (event) {
      console.log("Disconnected from server");
    }

    socket.onerror = function (error) {
      console.log("WebSocket error observed: ", error)
    }
  }, []);

  if (loading)
    return (
      <main className="bg-white min-h-screen ">
        <div className="flex justify-center items-center min-h-screen">
          <p>Saving to Re-Me...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="bg-white min-h-screen ">
        <div className="flex justify-center items-center min-h-screen">
          <p>{error}</p>
        </div>
      </main>
    );

  if (!isOnline) {
    return (
      <main className="bg-white space-y-2 rounded-3">
        <div className="flex justify-between bg-[#FFEC78]">
          <p>You are offline. Please check your internet connection and try again</p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-2 bg-[#202124]">
      <div className="flex justify-between bg-[#FFEC78] px-1.5 py-2">
        <div className="flex items-center gap-2">
          <Check className="h-6 w-6" strokeWidth={3} />
          <p className="font-700 text-xl">Saved to Library</p>
        </div>

        <button className="uppercase font-500" onClick={() => { }}>
          Remove
        </button>
      </div>

      <div className="flex flex-col gap-2 py-2 px-3">
        <div className="flex gap-4">
          <img
            src={tab?.image ?? tab?.favIconUrl}
            alt={tab?.title}
            className="h-16 w-20 rounded-[3px] bg-[#878787] object-cover w-1/3"
          />

          <div className="flex flex-col justify-center w-2/3 overflow-hidden text-[#93A3B6] text-[10px] font-700">
            <div className="truncate uppercase">{tab?.title}</div>
            <a href={tab?.url} className="underline truncate">
              {tab?.url}
            </a>
          </div>
        </div>

        <div className="h-[2px] bg-[#2A2A2A]" />

        <a title="Library" className="w-fit cursor-pointer" onClick={() => gotoLibrary()}>
          <List className="h-6 w-6" strokeWidth={3} color="#FFEC78" />
        </a>
      </div>
    </main>
  );
}

export default App;
