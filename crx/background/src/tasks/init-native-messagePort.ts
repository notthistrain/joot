import { EClipboardFormat, EJootTarget, IChromeBaseMessage, IChromeRuntimeMessageHandler, IClipboardDataPayload } from "joot-types"
import { setAction } from "joot-utils"

interface IRustAppMessage {
    index: number
    total: number
    data: string | Array<number>
    format: EClipboardFormat
}

class JootRustAppMessagePort {
    static instance: JootRustAppMessagePort
    static getInstance() {
        try {
            new JootRustAppMessagePort()
        } catch (error) {
            // console.log(error)
        }
        return JootRustAppMessagePort.instance
    }

    private readonly app_name = "com.joot"
    private port: chrome.runtime.Port

    message_data_format?: EClipboardFormat
    message_data_ref?: string

    constructor() {
        if (JootRustAppMessagePort.instance) {
            throw new Error("instance is already existed")
        }
        chrome.runtime.onConnectNative.addListener(this.connected_log)
        this.port = chrome.runtime.connectNative(this.app_name)

        JootRustAppMessagePort.instance = this
        Object.defineProperty(JootRustAppMessagePort, "instance", { writable: false })
    }

    start() {
        this.port.onMessage.addListener(this.handler)
    }

    private connected_log = (port: chrome.runtime.Port) => {
        if (port === this.port) {
            console.log(`native message port <${this.app_name}> connnected`)
            this.port.onDisconnect.addListener(this.disconected_log)
            chrome.runtime.onConnectNative.removeListener(this.connected_log)
        }
    }
    private disconected_log = () => {
        console.warn(`native message port <${this.app_name}> disconnnected`)
        this.port.onDisconnect.removeListener(this.disconected_log)
        this.port.onMessage.removeListener(this.handler)
    }
    private handler = (msg: IRustAppMessage, _port: chrome.runtime.Port) => {
        console.log("receive native message")
        if (typeof msg === 'object') {
            const { index, total, data: origin_data, format } = msg
            let data: string
            if (Array.isArray(origin_data)) {
                const blob = new Blob([new Uint8Array(origin_data)], { type: 'image/png' })
                const url = URL.createObjectURL(blob)
                data = url
            } else {
                data = origin_data
            }
            this.message_data_ref = data
            this.message_data_format = format
            try {
                const message: IChromeBaseMessage<IClipboardDataPayload> = {
                    target: EJootTarget.Popup,
                    data: {
                        data,
                        format
                    },
                    action: "clipboard:change"
                }
                chrome.runtime.sendMessage(message)
            } catch (error) {
                console.log(<Error>error.message)
            }
            chrome.tts.speak("clipboard changed")
        }
    }
}

const get_clipboard_data_handler: IChromeRuntimeMessageHandler = async function (
    msg, sender, sendResponse
) {
    const message_port = JootRustAppMessagePort.getInstance()
    sendResponse({
        format: message_port.message_data_format,
        data: message_port.message_data_ref
    })
}
setAction("clipboard:getdata", get_clipboard_data_handler)

export function init_native_message_port() {
    const message_port = JootRustAppMessagePort.getInstance()
    message_port.start()
    globalThis.runtime_messager.add_listener(get_clipboard_data_handler)
}