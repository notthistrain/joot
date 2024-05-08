export * from './bootup'
export * from './runtimeMessager'
export * from './service-worker'

export function wait(duration = 500) {
    return new Promise((resolve) => setTimeout(resolve, duration))
}

export function immediate() {
    return new Promise((resolve) => setImmediate(resolve))
}

export function waterfall(input: any, fns: ((input: any, next: (input: any) => void) => void)[]) {
    if (!Array.isArray(fns)) throw new Error("fns must be array")
    let index = 0
    async function run(input: any) {
        if (index >= fns.length) return
        let fn = fns[index]
        index++
        if (typeof fn !== "function") throw new Error("task must be a function")
        await fn(input, run)
    }
    return async () => await run(input)
}