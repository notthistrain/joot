import { bootup_serial } from 'joot-utils'
import { init_render, init_runtime_message } from './tasks'

bootup_serial([
    init_runtime_message,
    init_render
])