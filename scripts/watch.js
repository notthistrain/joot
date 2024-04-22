import { exec } from "child_process"
import { watch } from "chokidar"
import { createServer } from "http"
// import { HR_SERVER_PORT } from '../consts'

const popup_dir = "crx/popup"
const background_dir = "crx/background"
const joot_types_dir = "packages/joot-types"
const joot_utils_dir = "packages/joot-utils"


const watcher = watch(
    [
        "assets/**/*",
        `${popup_dir}/popup.html`,
        `${popup_dir}/src/**/*`,
        `${popup_dir}/plugins/**/*`,
        `${popup_dir}/types/**/*`,
        `${background_dir}/src/**/*`,
        `${background_dir}/types/**/*`,
        `${joot_types_dir}/src/**/*`,
        `${joot_utils_dir}/src/**/*`
    ],
    {
        persistent: true,
        ignoreInitial: true,
    }
)

let _server
let _response
let _timer
let _id = 0

let timer
var sub_process

function exec_build() {
    if (timer) clearTimeout(timer)
    if (sub_process) {
        sub_process.kill()
        sub_process = undefined
    }
    timer = setTimeout(() => {
        console.log("rebuild...")
        sub_process = exec('pnpm run build:crx:dev', (error, stdout, stderr) => {
            if (error) {
                console.error(`rebuild error`)
                return
            }
            console.log(`rebuild success`)
            if (_response) {
                _response.write(`id: ${_id++}\n\nevent:message\n\ndata: reload\n\n`)
                console.log('crx hr server send reload...')
            }
        })
        sub_process.on('close', () => {
            sub_process = undefined
        })
    }, 500)
}

watcher
    .on('change', exec_build)
    .on('unlink', exec_build)
    .on('add', exec_build)
    .on('unlinkDir', exec_build)
    .on('addDir', exec_build)
    .on('error', console.log)
    .on('ready', () => {
        console.log("watch ready")
        _server = createServer((request, response) => {
            if (request.url === '/reload' && !_response) {
                response.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': "*"
                })
                request.on('close', () => {
                    response.end()
                    _response = null
                    clearInterval(_timer)
                    console.log('crx hr server client closed...')
                })
                _response = response
                clearInterval(_timer)
                _timer = setInterval(() => {
                    if (_response) {
                        _response.write(`id: ${_id++}\n\nevent: notice\n\n`)
                    }
                }, 5000)
                console.log('crx hr server on client connection...')
            } else {
                response.writeHead(404)
                response.end()
            }
        })
        _server.listen(7347)
        _server.addListener('listening', () => {
            console.log('crx hr server listening...')
        })
        exec_build()
    })