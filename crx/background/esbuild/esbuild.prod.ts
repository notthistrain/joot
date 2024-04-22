import { build } from "esbuild"
import { resolve } from "path"

const root_dir = resolve(__dirname, "../../../")
const src_dir = resolve(__dirname, "../", "src")

build({
    entryPoints: [resolve(src_dir, "index.ts")],
    bundle: true,
    format: "esm",
    minify: true,
    outfile: resolve(root_dir, "bundle", "background.js"),
    sourcemap: "both",
    define: { __ENV__: JSON.stringify(<string>process.env.NODE_ENV) },
    alias: {
        '~': root_dir,
        '@': src_dir
    }
})
    .catch(() => process.exit(1))