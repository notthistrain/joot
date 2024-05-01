import { RuntimeMessager, setAction } from 'joot-utils'
import { ECommandStatus, EJootTarget, IChromeRuntimeMessageHandler, IScrollSizePayload, IScrollToPayload } from 'joot-types'

const get_scroll_size_handler: IChromeRuntimeMessageHandler = async (data, sender, sendResponse) => {
    const payload: IScrollSizePayload = {
        content_width: globalThis.document.documentElement.scrollWidth,
        content_height: globalThis.document.documentElement.scrollHeight,
        inner_width: globalThis.innerWidth,
        inner_height: globalThis.innerHeight,
        original_scroll_x: globalThis.screenX,
        original_scroll_y: globalThis.screenY
    }
    sendResponse(payload)
}
setAction('webpage:get-scroll-size', get_scroll_size_handler)

const scroll_to_handler: IChromeRuntimeMessageHandler = async (data: IScrollToPayload, sender, sendResponse) => {
    const { x = 0, y = 0 } = data
    globalThis.scrollTo({ top: y, left: x, behavior: 'instant' })
    sendResponse(ECommandStatus.FINISH)
}
setAction("webpage:scroll-to", scroll_to_handler)

export async function init_runtime_message() {
    const runtime_messager = new RuntimeMessager(EJootTarget.ContentScript)
    globalThis.runtime_messager = runtime_messager
    globalThis.runtime_messager.add_listeners(
        [
            get_scroll_size_handler,
            scroll_to_handler
        ]
    )
}