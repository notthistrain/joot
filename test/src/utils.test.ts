import { immediate, wait, waterfall } from "joot-utils"
describe("nodejs", () => {
    test("eventloop", async () => {
        const result: string[] = []
        const runner = waterfall(
            "start",
            [
                async (input, next) => {
                    await immediate()
                    result.push(input)
                    next("immediate")
                },
                async (input, next) => {
                    await wait(0)
                    result.push(input)
                    next("timeout")
                },
                async (input, next) => {
                    await immediate()
                    result.push(input)
                    next("over")
                },
                async (input) => {
                    await immediate()
                    result.push(input)
                },
            ]
        )
        await runner()
        await wait()
        expect(result).toEqual(["start", "immediate", "timeout", "over"])
    })
})