export type EContentScriptAction = "webpage:get-scroll-size" | "webpage:scroll-to"

export interface IScrollSizePayload {
    content_width: number
    content_height: number
    inner_width: number
    inner_height: number
    original_scroll_x: number
    original_scroll_y: number
}

export interface IScrollToPayload {
    x: number
    y: number
}
