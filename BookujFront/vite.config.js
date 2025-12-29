import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  if (command === "serve") {
    // dev server
    return {
      plugins: [react()],
      server: {
        https: {
          key: fs.readFileSync("./certs/localhost-key.pem"),
          cert: fs.readFileSync("./certs/localhost.pem"),
        },
      },
    };
  } else {
    // production build
    return {
      plugins: [react()],
      // żadnego https w buildzie
    };
  }
});
