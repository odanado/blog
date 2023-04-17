import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.ORIGIN ?? "http://localhost:3000",
  integrations: [sitemap()],
});
