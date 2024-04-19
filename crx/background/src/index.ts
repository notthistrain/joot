import { bootup_serial } from "joot-utils"
import { init_native_message_port } from "./tasks"
import { init_runtime_message } from "./tasks/initRuntimeMesage"

void bootup_serial([
    init_runtime_message,
    init_native_message_port
])