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


// =====================================================
// 欢迎参加有赞前端 Coding 面试
// =====================================================
/**
 * 题目 1：实现一个节流函数
 */
function throttle(fn: Function, wait: number): Function {
    // coding ...
    let slamp = performance.now()
    return function (...args: any[]) {
        let now = performance.now()
        if (now - slamp < wait) {
            return
        }
        slamp = now
        fn(...args)
    }
}
describe("throttle", () => {
    test("test", async () => {
        function log() {
            console.log(1)
        }
        let _log = throttle(log, 1000)
        _log()
        _log()
        await wait(1200)
        _log()
        await wait(2000)
    })
})
/**
 * 题目 2：实现 `getValue` 函数，安全的获取目标对象指定 `path` 的值
 *
 * @输入 object: `{ a: [{ b: { c: 3 } }] }` path: `a.b.c`
 * @输出 3
 *
 * @输入 array: `[{ a: { b: [1]} }]` path: `[0].a.b.[0]`
 * @输出 1
 */
function getValue(obj: any, path: string) {
    // coding ...
    try {
        let temp_obj = obj
        let array_index_reg = /\[\d\]/g
        const path_split = path.split(".")
        for (let i = 0; i < path_split.length; i++) {
            let key = path_split[i]
            if (array_index_reg.test(key)) {
                let _key = key.slice(1)
                _key = _key.slice(0, _key.length - 1)
                temp_obj = temp_obj[_key]
            } else {
                if (Array.isArray(temp_obj) && temp_obj.length === 1) {
                    temp_obj = temp_obj[0][key]
                } else {
                    temp_obj = temp_obj[key]
                }
            }
        }
        return temp_obj
    } catch (error) {
        throw new Error("path is invalid")
    }
}
describe("getvalue", () => {
    test("test", async () => {
        expect(getValue({ a: [{ b: { c: 3 } }] }, "a.b.c")).toBe(3)
        expect(getValue([{ a: { b: [1] } }], "[0].a.b.[0]")).toBe(1)
    })
})
/**
 * 题目 3：实现 `Promise.all` 方法
 */
function promiseAll(results: unknown[]): Promise<any[]> {
    // coding ...
    return new Promise((resolve, reject) => {
        try {
            let array = new Array<any>(results.length)
            let count = 0
            for (let i = 0; i < results.length; i++) {
                let input = results[i]
                if (!(input instanceof Promise)) {
                    array[i] = input
                    count++
                } else {
                    input.then(res => {
                        array[i] = res
                        count++
                        if (count === results.length) {
                            resolve(array)
                        }
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
/**
 * 加分题：实现 TypeScript 中的 GetReturnType<T> 类型
 *
 * @输入 GetReturnType<(a: number) => Promise<number>>
 * @输出 Promise<number>
 */
type GetReturnType<T extends (...arg: any[]) => any> = Promise<ReturnType<T>>