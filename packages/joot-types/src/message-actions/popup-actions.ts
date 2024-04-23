export type EPopupAction = "clipboard:change"

export enum EClipboardFormat {
    Text = "Text",
    Image = "Image"
}

export interface IClipboardDataPayload {
    data: string | number[],
    format: EClipboardFormat
}