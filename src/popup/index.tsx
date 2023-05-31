import "@unocss/reset/tailwind.css"
import React from "react"
import ReactDOM from "react-dom/client"
import "virtual:uno.css"
import "./index.css"
import App from "./Popup"

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
