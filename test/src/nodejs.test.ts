import { wait } from "joot-utils"
describe("nodejs", () => {
    test("eventloop", async () => {
        setTimeout(() => {
            console.log("timeout")
        })
        setImmediate(() => {
            console.log("immediate")
        })
        await wait()
    })
})