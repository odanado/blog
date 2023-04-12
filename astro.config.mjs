import { defineConfig } from "astro/config";
// https://astro.build/config
export default defineConfig({
  site: process.env.ORIGIN ?? "http://localhost:3000",
  integrations: [],
});
