import { bootup_serial } from "joot-utils"
import { init_env, init_native_message_port, init_runtime_message } from "./tasks"

void bootup_serial([
    init_env,
    init_runtime_message,
    init_native_message_port
])