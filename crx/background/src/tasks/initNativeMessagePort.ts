export function initNativeMessagePort() {
    const port = chrome.runtime.connectNative('com.joot')
    console.log("start up")
    port.onMessage.addListener((message) => {
        console.log(`message from native: `, message)
    })
    port.onDisconnect.addListener(() => {
        console.log(`native port disconnect`)
    })
}