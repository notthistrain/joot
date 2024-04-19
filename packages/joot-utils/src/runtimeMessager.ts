import { EJootAction, EJootTarget, IChromeRuntimeMessageHandler } from "joot-types"

export function setAction(action: EJootAction, handler: IChromeRuntimeMessageHandler) {
    Object.defineProperty(handler, "name", { value: action })
    Object.freeze(handler.name)
}

export class RuntimeMessager {
    private readonly handler_map = new Map<EJootAction, IChromeRuntimeMessageHandler[]>()
    constructor(
        private readonly target: EJootTarget
    ) {
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg?.target === this.target && msg.action && this.handler_map.has(msg.action)) {
                this.handler_map.get(msg.action)?.forEach(handler => handler(msg.data, sender, sendResponse))
            }
            return true
        })
    }
    add_listener(handler: IChromeRuntimeMessageHandler) {
        const action = <EJootAction>handler.name
        const handlers = this.handler_map.get(action)
        if (Array.isArray(handlers)) {
            handlers.push(handler)
        } else {
            this.handler_map.set(action, [handler])
        }
        return () => this.remove_listener(handler)
    }
    remove_listener(handler: IChromeRuntimeMessageHandler) {
        const action = <EJootAction>handler.name
        const handlers = this.handler_map.get(action)
        if (Array.isArray(handlers)) {
            const index = handlers.indexOf(handler)
            if (index !== -1) {
                handlers.splice(index, 1)
            }
        }
    }
    add_once_listener(handler: IChromeRuntimeMessageHandler) {
        const action = <EJootAction>handler.name
        const once_handler: IChromeRuntimeMessageHandler = (...args) => {
            handler(...args)
            this.remove_listener(once_handler)
        }
        this.add_listener(once_handler)
        return () => this.remove_listener(once_handler)
    }
    clear_action(action: EJootAction) {
        this.handler_map.set(action, [])
    }
    clear_all() {
        this.handler_map.clear()
    }
}