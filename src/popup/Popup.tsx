import { Check, List } from "lucide-react";
import { useEffect, useState } from "react";
import LoaderIcon from "../assets/loaderIcon";
import { CurrentTab } from "../types";
import { getCurrentTab, saveLink } from "../utils";
import "./Popup.css";

function App() {
  const [tab, setTab] = useState<CurrentTab | null>();
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);

  const gotoLibrary = (path?: string) => {
    const url = path ? `https://re-me.onrender.com/${path}` : "https://re-me.onrender.com";
    chrome.tabs.create({
      url,
    });
  };

  const onUndo = async (data: { id: string; token: string }) => {
    setRemoving(true);
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "REMOVE_LINK", data }, (response) => {
        if (response.error) {
          reject(response);
          setRemoving(false);
          setError("Something went wrong. Please try again later.");
        } else {
          resolve(response);
          setRemoved(true);
          setRemoving(false);
          setTab(null);
        }
      });
    });
  };

  const onSave = async (token?: any) => {
    setSaving(true);
    try {
      const currentTab = await getCurrentTab();

      const res = (await saveLink({
        ...currentTab,
        token: token ?? user.token,
      })) as any;

      if ("errors" in res) {
        res.errors.includes("limit")
          ? setError("You have reached the limit of 6 links.")
          : res.errors.includes("Item link has already been saved")
          ? setError("This link has already been saved.")
          : setError("Something went wrong. Please try again later.");

        setSaving(false);
        return;
      }

      setItem(res);
      setTab(currentTab);
      setSaving(false);
      setRemoved(false);
    } catch (error) {
      console.log(error);

      setError("Something went wrong. Please try again later.");
      setSaving(false);
    }
  };

  const init = async () => {
    setSaving(true);
    chrome.runtime.sendMessage({ action: "AUTH_CHECK" }, async (data) => {
      const { user, authenticated } = data;

      // check auth status and redirect to signin page if not authenticated
      if (!authenticated) return gotoLibrary("signin");

      setUser(user);

      // save the link to the re-me library
      await onSave(user.token);
    });
  };

  useEffect(() => {
    init();
  }, []);

  if (error)
    return (
      <main className="text-white min-h-screen ">
        <div className="flex justify-center items-center min-h-screen">
          <p>{error}</p>
        </div>
      </main>
    );

  return (
    <main className="space-y-2 bg-[#202124]">
      <div className="flex justify-between bg-[#FFEC78] px-3 py-2">
        {saving || removing ? (
          <div className="flex items-center gap-3">
            <LoaderIcon className="h-5 w-5 animate-spin" />
            <p className="font-700 text-lg">{saving ? "Saving to" : "Removing from"} Library...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Check className="h-6 w-6" strokeWidth={3} />
              <p className="font-700 text-lg">
                {removed ? "Removed from Library" : "Saved to Library"}
              </p>
            </div>

            <button
              className="uppercase font-500"
              onClick={
                removed
                  ? () => onSave()
                  : () =>
                      onUndo({
                        id: item.id,
                        token: user.token,
                      })
              }
            >
              {removed ? "Save" : "Undo"}
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 py-2 px-3">
        {/* hide the content when saving or item is removed */}
        {!saving && !removed && (
          <div className="flex gap-4">
            <img
              src={tab?.image ?? tab?.favIconUrl}
              alt={tab?.title}
              className="h-[60px] w-[70px] rounded-[3px] bg-[#878787] object-cover w-1/3"
            />

            <div className="flex flex-col justify-center w-2/3 overflow-hidden text-[#93A3B6] text-[10px] font-700">
              <div className="truncate uppercase">{tab?.title}</div>
              <a href={tab?.url} className="underline truncate">
                {tab?.url}
              </a>
            </div>
          </div>
        )}

        {/* separator */}
        <div className="h-[2px] bg-[#2A2A2A]" />

        <a title="Library" className="w-fit cursor-pointer" onClick={() => gotoLibrary()}>
          <List className="h-6 w-6" strokeWidth={3} color="#FFEC78" />
        </a>
      </div>
    </main>
  );
}

export default App;
