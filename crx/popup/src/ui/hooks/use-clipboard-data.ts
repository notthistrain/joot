import { IChromeRuntimeMessageHandler, IClipboardDataPayload } from "joot-types";
import { setAction } from "joot-utils";
import { useEffect, useState } from "react";

export function useClipboardData(input?: IClipboardDataPayload) {
    const [data, setData] = useState<IClipboardDataPayload | undefined>(input)
    useEffect(() => {
        const clipboard_change_handler: IChromeRuntimeMessageHandler = async (msg: IClipboardDataPayload) => setData(msg)
        setAction("clipboard:change", clipboard_change_handler)
        return globalThis.runtime_messager.add_listener(clipboard_change_handler)
    })
    return data
}