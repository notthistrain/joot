export * from './bootup'
export * from './runtimeMessager'
export * from './service-worker'

export function wait(duration = 500) {
    return new Promise((resolve) => setTimeout(resolve, duration))
}