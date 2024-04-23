export type EContentScriptAction = "webpage:get-scroll-size"

export interface IScrollSizePayload {
    width: number,
    height: number
}
