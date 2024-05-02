import { RuntimeMessager, composeDataURL, setAction, wait } from 'joot-utils'
import { ECommandStatus, EJootTarget, IChromeBaseMessage, IChromeRuntimeMessageHandler, IScrollSizePayload, IScrollToPayload } from 'joot-types'

const hide_scrollbar_css = `
    html::-webkit-scrollbar {
        display: none;
    }
    body::-webkit-scrollbar {
        display: none;
    }
`

let in_shot = false
let data_url_cache = ""

const get_screenshot_data_handler: IChromeRuntimeMessageHandler = async (data, sender, sendResponse) => {
    sendResponse(data_url_cache)
}
setAction("screenshot:get-data", get_screenshot_data_handler)

const call_screenshot_handler: IChromeRuntimeMessageHandler = async (data, sender, sendResponse) => {
    if (in_shot) {
        sendResponse(ECommandStatus.BUSY)
        return
    }
    try {
        in_shot = true
        const tab = (await chrome.tabs.query({ active: true }))[0]
        const get_scroll_size_msg: IChromeBaseMessage = {
            action: 'webpage:get-scroll-size',
            target: EJootTarget.ContentScript
        }
        const payload: IScrollSizePayload = await chrome.tabs.sendMessage(tab.id!, get_scroll_size_msg)
        const css_injection = {
            css: hide_scrollbar_css,
            target: {
                tabId: tab.id!
            }
        }
        await chrome.scripting.insertCSS(css_injection)
        const { content_width, content_height, inner_width, inner_height, original_scroll_x, original_scroll_y } = payload
        const x_scroll_count = Math.ceil(content_width / inner_width)
        const y_scroll_count = Math.ceil(content_height / inner_height)
        const data_url_array: Array<string> = []
        const scroll_to_msg: IChromeBaseMessage<IScrollToPayload> = {
            action: "webpage:scroll-to",
            target: EJootTarget.ContentScript,
            data: { x: 0, y: 0 }
        }
        for (let i = 0; i < y_scroll_count; i++) {
            for (let j = 0; j < x_scroll_count; j++) {
                scroll_to_msg.data = {
                    x: j * inner_width,
                    y: i * inner_height
                }
                await chrome.tabs.sendMessage(tab.id!, scroll_to_msg)
                await wait()
                const data_url = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' })
                data_url_array.push(data_url)
            }
        }
        scroll_to_msg.data = { x: original_scroll_x, y: original_scroll_y }
        await chrome.tabs.sendMessage(tab.id!, scroll_to_msg)
        chrome.scripting.removeCSS(css_injection)
        const data_url = await composeDataURL(payload, data_url_array)
        data_url_cache = data_url
        sendResponse(data_url)
        in_shot = false
    } catch (error) {
        in_shot = false
        sendResponse(ECommandStatus.ERROR)
        console.log(error)
    }
}
setAction("screenshot:call", call_screenshot_handler)

export async function init_runtime_message() {
    const runtime_messager = new RuntimeMessager(EJootTarget.Background)
    globalThis.runtime_messager = runtime_messager
    globalThis.runtime_messager.add_listeners([
        call_screenshot_handler,
        get_screenshot_data_handler
    ])
}