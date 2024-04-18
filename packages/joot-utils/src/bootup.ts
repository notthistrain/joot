export async function bootup_serial(tasks: Array<Function>) {
    for (const task of tasks) {
        await task()
    }
}