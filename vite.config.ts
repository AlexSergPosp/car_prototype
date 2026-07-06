import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "car_prototype";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${githubRepositoryName}/` : "/",
  plugins: [react(), tailwindcss()],
});
