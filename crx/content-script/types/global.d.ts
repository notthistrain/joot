import { RuntimeMessager } from 'joot-utils'

declare global {
    module globalThis {
        export var runtime_messager: RuntimeMessager;
    }
}