import { RuntimeMessager, setAction } from 'joot-utils'
import { EJootTarget, IChromeBaseMessage, IChromeRuntimeMessageHandler, IScrollSizePayload } from 'joot-types'

const call_screenshot_handler: IChromeRuntimeMessageHandler = async (data, sender, sendResponse) => {
    const tab = (await chrome.tabs.query({ active: true }))[0]
    if (tab?.id && tab.windowId) {
        const msg: IChromeBaseMessage = {
            action: 'webpage:get-scroll-size',
            target: EJootTarget.ContentScript
        }
        // const payload: IScrollSizePayload = await chrome.tabs.sendMessage(tab?.id, msg)
        // const window = await chrome.windows.get(tab.windowId)
        // await chrome.windows.update(tab.windowId, { width: payload.width, height: payload.height })
        const data_url = await chrome.tabs.captureVisibleTab(tab.windowId)
        // await chrome.windows.update(tab.windowId, { width: window.width, height: window.height })
        sendResponse(data_url)
    } else {
        sendResponse()
    }
}
setAction("screenshot:call", call_screenshot_handler)

export async function init_runtime_message() {
    const runtime_messager = new RuntimeMessager(EJootTarget.Background)
    globalThis.runtime_messager = runtime_messager
    globalThis.runtime_messager.add_listener(call_screenshot_handler)
}