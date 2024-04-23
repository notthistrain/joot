import { RuntimeMessager, setAction } from 'joot-utils'
import { EJootTarget, IChromeRuntimeMessageHandler, IScrollSizePayload } from 'joot-types'

const get_scroll_size_handler: IChromeRuntimeMessageHandler = async (data, sender, sendResponse) => {
    const payload: IScrollSizePayload = {
        width: globalThis.document.documentElement.scrollWidth,
        height: globalThis.document.documentElement.scrollHeight
    }
    sendResponse(payload)
}
setAction('webpage:get-scroll-size', get_scroll_size_handler)

export async function init_runtime_message() {
    const runtime_messager = new RuntimeMessager(EJootTarget.ContentScript)
    globalThis.runtime_messager = runtime_messager
    globalThis.runtime_messager.add_listener(get_scroll_size_handler)
}