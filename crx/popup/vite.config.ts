import { resolve } from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";

const root_dir = resolve(__dirname, "../../")
const src_dir = resolve(__dirname, "src")

export default defineConfig(() => {
    return {
        resolve: {
            alias: {
                '~': root_dir,
                '@': src_dir
            },
            extensions: [".ts", ".tsx"]
        },
        build: {
            sourcemap: true,
            outDir: resolve(root_dir, "bundle"),
            assetsDir: "",
            define: { __ENV__: JSON.stringify(<string>process.env.NODE_ENV) },
            rollupOptions: {
                input: "popup.html",
                output: {
                    entryFileNames: "[name].js",
                    chunkFileNames: "[name].js",
                    assetFileNames: "[name][extname]"
                }
            }
        },
        plugins: [react()]
    }
})