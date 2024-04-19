import { RuntimeMessager } from 'joot-utils'
import { EJootTarget } from 'joot-types'

export async function init_runtime_message() {
    const runtime_messager = new RuntimeMessager(EJootTarget.Background)
    globalThis.runtime_messager = runtime_messager
}