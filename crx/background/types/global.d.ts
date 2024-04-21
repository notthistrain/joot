import { RuntimeMessager } from "joot-utils"

declare global {
    declare const __ENV__: "production" | "development"
    module globalThis {
        export var runtime_messager: RuntimeMessager;
    }

    declare module chrome.runtime {
        export var onConnectNative: ExtensionConnectEvent;
    }
}
