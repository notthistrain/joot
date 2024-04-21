export async function init_env() {
    console.log(`env: ${__ENV__}`)
    if (__ENV__ === "development") {
        const eventSource = new EventSource(`http://127.0.0.1:${7347}/reload`);
        eventSource.addEventListener('message', (e) => {
            console.log("event source data: ", e.data)
            if (e.data === "reload") {
                chrome.runtime.reload()
            }
        })
        eventSource.addEventListener('error', console.log)
        eventSource.addEventListener('open', console.log)
    }
}