import { EBackgroundAction, EPopupAction } from "./messageActions"

export enum EJootTarget {
    Background = "Background",
    Popup = "Popup",
    ContentScript = "ContentScript"
}

export type EJootAction = EBackgroundAction | EPopupAction

export interface IChromeBaseMessage<T = undefined> {
    target: EJootTarget,
    action: EJootAction,
    data?: T
}

type TChromeMessageData = any

interface IChromeMessageHandler<T> {
    (data: TChromeMessageData, sender: T, sendResponse: (response?: any) => void): void
}

export type IChromeRuntimeMessageHandler = IChromeMessageHandler<chrome.runtime.MessageSender>

export * from "./messageActions"