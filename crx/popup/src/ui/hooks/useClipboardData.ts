import { IChromeRuntimeMessageHandler, IClipboardDataPayload } from "joot-types";
import { setAction } from "joot-utils";
import { useEffect, useState } from "react";

export function useClipboard(input_data?: IClipboardDataPayload) {
    const [data, setData] = useState<IClipboardDataPayload | undefined>(input_data)
    useEffect(() => {
        const clipboard_change_handler: IChromeRuntimeMessageHandler = async function (
            msg: IClipboardDataPayload, sender, sendResponse
        ) {
            setData(msg)
        }
        setAction("clipboard:change", clipboard_change_handler)
        globalThis.runtime_messager.add_listener(clipboard_change_handler)
        return globalThis.runtime_messager.add_listener(clipboard_change_handler)
    })
    return data
}