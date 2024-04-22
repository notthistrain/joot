import { HR_SERVER_PORT } from "~/consts"

export async function init_env() {
    console.log(`env: ${__ENV__}`)
    if (__ENV__ === "development") {
        const eventSource = new EventSource(`http://127.0.0.1:${HR_SERVER_PORT}/reload`);
        eventSource.addEventListener('message', (e) => {
            if (e.data === "reload") {
                chrome.runtime.reload()
            }
        })
        eventSource.addEventListener('error', (e) => console.log('event source error: ', e))
        eventSource.addEventListener('open', (e) => console.log('event source open: ', e))
    }
}