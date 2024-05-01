export * from './background-actions'
export * from './popup-actions'
export * from './content-script-actions'

export enum ECommandStatus {
    ERROR = "ERROR",
    BUSY = "BUSY",
    FINISH = "FINISH"
}