// vite.config.ts
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

// src/manifest.ts
import { defineManifest } from "@crxjs/vite-plugin";
var manifest_default = defineManifest({
  name: "create-chrome-ext",
  description: "",
  version: "0.0.0",
  manifest_version: 3,
  icons: {
    "16": "img/logo-16.png",
    "32": "img/logo-34.png",
    "48": "img/logo-48.png",
    "128": "img/logo-128.png"
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png"
  },
  options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/content/index.ts"]
    }
  ],
  web_accessible_resources: [
    {
      resources: ["img/logo-16.png", "img/logo-34.png", "img/logo-48.png", "img/logo-128.png"],
      matches: []
    }
  ],
  permissions: ["storage", "activeTab", "scripting", "tabs", "notifications"]
});

// src/read_pages_folder.ts
import globSync from "glob";
var pages = await globSync("pages/*.html");
var arrayKeyValuePairs = pages.map((file) => [file.split("\\").slice(-1).toString().split(".html").join(""), file]);
var config = Object.fromEntries(arrayKeyValuePairs);

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        input: config,
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [
      crx({ manifest: manifest_default }),
      UnoCSS(),
      react(),
      zipPack({
        outDir: `package`,
        inDir: "build",
        outFileName: `${manifest_default.short_name ?? manifest_default.name.replaceAll(" ", "-")}-extension-v${manifest_default.version}.zip`
      })
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIiwgInNyYy9yZWFkX3BhZ2VzX2ZvbGRlci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgemlwUGFjayBmcm9tICd2aXRlLXBsdWdpbi16aXAtcGFjaydcblxuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vc3JjL21hbmlmZXN0J1xuLy9AdHMtaWdub3JlXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL3NyYy9yZWFkX3BhZ2VzX2ZvbGRlcidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiBjb25maWcsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2NodW5rLVtoYXNoXS5qcycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICBwbHVnaW5zOiBbXG4gICAgICBjcngoeyBtYW5pZmVzdCB9KSxcbiAgICAgIFVub0NTUygpLFxuICAgICAgcmVhY3QoKSxcbiAgICAgIHppcFBhY2soe1xuICAgICAgICBvdXREaXI6IGBwYWNrYWdlYCxcbiAgICAgICAgaW5EaXI6ICdidWlsZCcsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb3V0RmlsZU5hbWU6IGAke21hbmlmZXN0LnNob3J0X25hbWUgPz8gbWFuaWZlc3QubmFtZS5yZXBsYWNlQWxsKCcgJywgJy0nKX0tZXh0ZW5zaW9uLXYke1xuICAgICAgICAgIG1hbmlmZXN0LnZlcnNpb25cbiAgICAgICAgfS56aXBgLFxuICAgICAgfSksXG4gICAgXSxcbiAgfVxufSlcbiIsICJpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBuYW1lOiBcImNyZWF0ZS1jaHJvbWUtZXh0XCIsXG4gIGRlc2NyaXB0aW9uOiBcIlwiLFxuICB2ZXJzaW9uOiBcIjAuMC4wXCIsXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIGljb25zOiB7XG4gICAgXCIxNlwiOiBcImltZy9sb2dvLTE2LnBuZ1wiLFxuICAgIFwiMzJcIjogXCJpbWcvbG9nby0zNC5wbmdcIixcbiAgICBcIjQ4XCI6IFwiaW1nL2xvZ28tNDgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJpbWcvbG9nby0xMjgucG5nXCIsXG4gIH0sXG4gIGFjdGlvbjoge1xuICAgIGRlZmF1bHRfcG9wdXA6IFwicG9wdXAuaHRtbFwiLFxuICAgIGRlZmF1bHRfaWNvbjogXCJpbWcvbG9nby00OC5wbmdcIixcbiAgfSxcbiAgb3B0aW9uc19wYWdlOiBcIm9wdGlvbnMuaHRtbFwiLFxuICBiYWNrZ3JvdW5kOiB7XG4gICAgc2VydmljZV93b3JrZXI6IFwic3JjL2JhY2tncm91bmQvaW5kZXgudHNcIixcbiAgICB0eXBlOiBcIm1vZHVsZVwiLFxuICB9LFxuICBjb250ZW50X3NjcmlwdHM6IFtcbiAgICB7XG4gICAgICBtYXRjaGVzOiBbXCJodHRwOi8vKi8qXCIsIFwiaHR0cHM6Ly8qLypcIl0sXG4gICAgICBqczogW1wic3JjL2NvbnRlbnQvaW5kZXgudHNcIl0sXG4gICAgfSxcbiAgXSxcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4gICAge1xuICAgICAgcmVzb3VyY2VzOiBbXCJpbWcvbG9nby0xNi5wbmdcIiwgXCJpbWcvbG9nby0zNC5wbmdcIiwgXCJpbWcvbG9nby00OC5wbmdcIiwgXCJpbWcvbG9nby0xMjgucG5nXCJdLFxuICAgICAgbWF0Y2hlczogW10sXG4gICAgfSxcbiAgXSxcbiAgcGVybWlzc2lvbnM6IFtcInN0b3JhZ2VcIiwgXCJhY3RpdmVUYWJcIiwgXCJzY3JpcHRpbmdcIiwgXCJ0YWJzXCJdLFxufSk7XG4iLCAiaW1wb3J0IGdsb2JTeW5jIGZyb20gJ2dsb2InO1xuXG5jb25zdCBwYWdlcyA9IGF3YWl0IGdsb2JTeW5jKCdwYWdlcy8qLmh0bWwnKVxuXG5jb25zdCBhcnJheUtleVZhbHVlUGFpcnMgPSBwYWdlcy5tYXAoZmlsZSA9PiBbZmlsZS5zcGxpdCgnXFxcXCcpLnNsaWNlKC0xKS50b1N0cmluZygpLnNwbGl0KCcuaHRtbCcpLmpvaW4oJycpLCBmaWxlXSlcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IE9iamVjdC5mcm9tRW50cmllcyhhcnJheUtleVZhbHVlUGFpcnMpXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxXQUFXO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxhQUFhOzs7QUNKcEIsU0FBUyxzQkFBc0I7QUFFL0IsSUFBTyxtQkFBUSxlQUFlO0FBQUEsRUFDNUIsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1Qsa0JBQWtCO0FBQUEsRUFDbEIsT0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWU7QUFBQSxJQUNmLGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsSUFDaEIsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLGlCQUFpQjtBQUFBLElBQ2Y7QUFBQSxNQUNFLFNBQVMsQ0FBQyxjQUFjLGFBQWE7QUFBQSxNQUNyQyxJQUFJLENBQUMsc0JBQXNCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQUEsRUFDQSwwQkFBMEI7QUFBQSxJQUN4QjtBQUFBLE1BQ0UsV0FBVyxDQUFDLG1CQUFtQixtQkFBbUIsbUJBQW1CLGtCQUFrQjtBQUFBLE1BQ3ZGLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxhQUFhLENBQUMsV0FBVyxhQUFhLGFBQWEsTUFBTTtBQUMzRCxDQUFDOzs7QUNuQ0QsT0FBTyxjQUFjO0FBRXJCLElBQU0sUUFBUSxNQUFNLFNBQVMsY0FBYztBQUUzQyxJQUFNLHFCQUFxQixNQUFNLElBQUksVUFBUSxDQUFDLEtBQUssTUFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztBQUUzRyxJQUFNLFNBQVMsT0FBTyxZQUFZLGtCQUFrQjs7O0FGSzNELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFNBQU87QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxNQUNSLGVBQWU7QUFBQSxRQUNiLE9BQU87QUFBQSxRQUNQLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQLElBQUksRUFBRSwyQkFBUyxDQUFDO0FBQUEsTUFDaEIsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBLFFBRVAsYUFBYSxHQUFHLGlCQUFTLGNBQWMsaUJBQVMsS0FBSyxXQUFXLEtBQUssR0FBRyxnQkFDdEUsaUJBQVM7QUFBQSxNQUViLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
