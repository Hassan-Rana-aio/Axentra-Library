import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/stories/**"],
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "AxentraLibrary",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
