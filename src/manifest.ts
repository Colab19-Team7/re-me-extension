import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  name: "Re-Me",
  description: "Re-Me reminds you to revisit a website after a set period of time.",
  version: "0.0.2",
  manifest_version: 3,
  icons: {
    "16": "img/logo-16.png",
    "32": "img/logo-34.png",
    "48": "img/logo-48.png",
    "128": "img/logo-128.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png",
    default_title: "Save to Re-Me",
  },
  // options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/index.ts"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["img/logo-16.png", "img/logo-34.png", "img/logo-48.png", "img/logo-128.png"],
      matches: [],
    },
  ],
  permissions: ["tabs", "notifications", "alarms", "storage"],
});
