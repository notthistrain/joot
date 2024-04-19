import { resolve } from "path"
import { defineConfig } from "vite"

const root_dir = resolve(__dirname, "../../")
const src_dir = resolve(__dirname, "../src")

export default defineConfig(() => {
    return {
        build: {
            sourcemap: true,
            outDir: resolve(root_dir, "bundle"),
            assetsDir: "",
            rollupOptions: {
                input: "popup.html"
            }
        },
        plugins: []
    }
})