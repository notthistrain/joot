import { EJootTarget, IChromeBaseMessage, IChromeRuntimeMessageHandler, IClipboardDataPayload } from "joot-types";
import { setAction } from "joot-utils";
import { useEffect, useState } from "react";

export function useClipboard() {
    const [data, setData] = useState<IClipboardDataPayload | undefined>()
    useEffect(() => {
        const message: IChromeBaseMessage = {
            action: "clipboard:getdata",
            target: EJootTarget.Background
        }
        chrome.runtime.sendMessage(message).then((value: IClipboardDataPayload) => setData(value))
        const clipboard_change_handler: IChromeRuntimeMessageHandler = async (msg: IClipboardDataPayload) => setData(msg)
        setAction("clipboard:change", clipboard_change_handler)
        globalThis.runtime_messager.add_listener(clipboard_change_handler)
        return globalThis.runtime_messager.add_listener(clipboard_change_handler)
    })
    return data
}