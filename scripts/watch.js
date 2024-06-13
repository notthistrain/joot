import { exec } from "child_process"
import { watch } from "chokidar"
import { createServer } from "http"
// import { HR_SERVER_PORT } from '../consts'

const background_dir = "crx/background"
const content_script_dir = "crx/content-script"
const popup_dir = "crx/popup"
const joot_types_dir = "packages/joot-types"
const joot_utils_dir = "packages/joot-utils"

const options = [
    {
        name: "assets | joot-type | joot-utils",
        paths: [
            "assets/**/*",
            `${joot_types_dir}/src/**/*`,
            `${joot_utils_dir}/src/**/*`
        ],
        cmd: "pnpm run build:dev'",
        timer: undefined,
        process: undefined
    },
    {
        name: "background",
        paths: [
            `${background_dir}/src/**/*`,
            `${background_dir}/types/**/*`
        ],
        cmd: "pnpm -F background build:dev",
        timer: undefined,
        process: undefined
    },
    {
        name: "popup",
        paths: [
            `${popup_dir}/popup.html`,
            `${popup_dir}/src/**/*`,
            `${popup_dir}/types/**/*`
        ],
        cmd: "pnpm -F popup build:dev",
        timer: undefined,
        process: undefined
    },
    {
        name: "content-script",
        paths: [
            `${content_script_dir}/src/**/*`,
            `${content_script_dir}/types/**/*`
        ],
        cmd: "pnpm -F content-script build:dev",
        timer: undefined,
        process: undefined
    }
]

class ESServer {
    id
    response
    timer
    server
    constructor() {
        this.server = createServer((request, response) => {
            if (request.url === '/reload' && !this.response) {
                response.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': "*"
                })
                request.on('close', () => {
                    response.end()
                    this.response = null
                    clearInterval(this.timer)
                    console.log('crx hr server client closed...')
                })
                this.response = response
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    if (this.response) {
                        this.response.write(`id: ${this.id++}\n\nevent: notice\n\n`)
                    }
                }, 5000)
                console.log('crx hr server on client connection...')
            } else {
                response.writeHead(404)
                response.end()
            }
        })
        this.server.listen(7347)
        this.server.addListener('listening', () => {
            console.log('crx hr server listening...')
        })
    }
    execReload(option) {
        if (option.timer) clearTimeout(option.timer)
        if (option.process) {
            option.process.kill()
            option.process = undefined
        }
        option.timer = setTimeout(() => {
            console.log(`${option.name} rebuild...`)
            option.process = exec(option.cmd, (error) => {
                if (error) {
                    console.error(`${option.name} rebuild error`)
                    return
                }
                if (this.response) {
                    this.response.write(`id: ${this.id++}\n\nevent:message\n\ndata: reload\n\n`)
                    console.log('crx hr server send reload...')
                }
            })
            option.process.on('close', () => {
                option.process = undefined
            })
        }, 500)
    }
}

const es_server = new ESServer()

options.forEach((option) => {
    const watcher = watch(option.paths, { persistent: true, ignoreInitial: true })
    const handler = () => es_server.execReload(option)
    watcher
        .on('change', handler)
        .on('unlink', handler)
        .on('add', handler)
        .on('unlinkDir', handler)
        .on('addDir', handler)
        .on('error', console.log)
        .on('ready', () => {
            console.log(`${option.name} watch ready`)
        })
})