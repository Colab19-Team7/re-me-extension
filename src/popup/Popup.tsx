import { useState } from "react"

function App() {
  const [url, setUrl] = useState("create-chrome-ext")

  return (
    <main className="bg-white space-y-2">
      <div className="flex justify-between">
        <p className="">Saved to RE-ME</p>

        <button className="uppercase" onClick={() => {}}>
          Remove
        </button>
      </div>

      <div className="flex gap-4">
        <div className="h-16 w-20 border border-black bg-[#878787]" />

        <div className="flex flex-col justify-center">
          <div>SITE NAME</div>
          <a href="#" className="underline">
            https://www.google.com
          </a>
        </div>
      </div>

      <select className="w-full bg-[#878787] h-8">
        <option>Reminder Me</option>
        <option>Reminder Me</option>
        <option>Reminder Me</option>
        <option>Reminder Me</option>
      </select>
    </main>
  )
}

export default App
