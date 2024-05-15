import { wait } from "joot-utils"

describe("function", () => {
    test("new", () => {
        function _create(prototype: Object) {
            function F() { }
            F.prototype = prototype
            //@ts-ignore
            return (new F())
        }
        function _new(fn: any, ...args: any[]) {
            if (typeof fn !== 'function') throw new Error('must be function')
            let context = Object.create(fn.prototype)
            const result = fn.apply(context, args)
            return result instanceof Object ? result : context
        }
        expect(_new(Array, 2)).toEqual(new Array(2))
    })
    const test_obj = {
        name: "obj"
    }
    function test_fn(str: string) {
        //@ts-ignore
        return str + this.name
    }
    test("call", () => {
        //@ts-ignore
        Function.prototype._call = function (target: any, ...args: any[]) {
            if ([null, undefined].includes(target)) {
                target = globalThis
            } else {
                target = Object(target)
            }
            const key = Symbol("temp_key")
            target[key] = this
            const result = target[key](...args)
            delete target[key]
            return result
        }
        //@ts-ignore
        expect(test_fn._call(test_obj, 'name is ')).toBe("name is obj")
    })
    test("bind", () => {
        //@ts-ignore
        Function.prototype._bind = function (target: any, ...args: any[]) {
            let origin_fn = this
            function bind_fn(...second_args: any[]) {
                //@ts-ignore
                return origin_fn.call(this instanceof bind_fn ? this : target, ...args, ...second_args)
            }
            bind_fn.prototype = Object.create(origin_fn)
            return bind_fn
        }
        //@ts-ignore
        expect(test_fn._bind(test_obj)("name is ")).toBe("name is obj")
    })
})
describe("ajax", () => {
    test("xhr", () => {
        function xhr() {
            return new Promise(resolve => {
                const request = new XMLHttpRequest()
                request.responseType = 'json'
                request.setRequestHeader('Content-Type', 'application/json')
                request.open('post', 'url', true)
                request.addEventListener('readystatechange', e => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        resolve(request.response)
                    }
                })
                request.send(JSON.stringify({}))
            })
        }
    })
})

describe('promise', () => {

    class _Promise<T = unknown> {
        static REJECTED = Symbol('rejected')
        static RESOLVED = Symbol('resolved')
        static PENDING = Symbol('pending')

        public state = _Promise.PENDING
        private value?: T
        private resolve_fns: Array<Function> = []
        private reject_fns: Array<Function> = []

        constructor(run: (rs: Function, rj: Function) => any) {
            if (!(this instanceof _Promise)) {
                throw new Error('can only use new')
            }
            try {
                run(this.resolve, this.reject)
            } catch (error) {
                this.reject(error)
            }
        }

        private resolve = (value: T) => {
            setTimeout(() => {
                if (this.state !== _Promise.PENDING) return
                this.value = value
                this.state = _Promise.RESOLVED
                this.resolve_fns.forEach(fn => (fn && fn(value)))
            }, 0)
        }

        private reject = (value: T) => {
            setTimeout(() => {
                if (this.state !== _Promise.PENDING) return
                this.value = value
                this.state = _Promise.REJECTED
                this.reject_fns.forEach(fn => (fn && fn(value)))
            }, 0)
        }

        then(on_resolve: Function, on_reject?: Function) {
            if (!on_resolve) {
                on_resolve = (v: any) => v
            }
            if (!on_reject) {
                on_reject = (v: any) => v
            }
            return new _Promise<T>((resolve, reject) => {
                switch (this.state) {
                    case _Promise.RESOLVED: {
                        on_resolve(this.value)
                        return
                    }
                    case _Promise.REJECTED: {
                        on_reject(this.value)
                        return
                    }
                    case _Promise.PENDING: {
                        this.resolve_fns.push((v: T) => {
                            const result = on_resolve(v)
                            return result instanceof _Promise ? result.then(resolve, reject) : resolve(result)
                        })
                        this.reject_fns.push((v: any) => {
                            const result = on_reject(v)
                            return result instanceof _Promise ? result.then(resolve, reject) : reject(result)
                        })
                        return
                    }
                }
            })
        }
    }

    test('simple', async () => {
        let tag = 0
        const promise = new _Promise((rs) => {
            setTimeout(() => rs(1), 0)
        })
        expect(tag).toBe(0)

        function resolve(v: number) {
            tag = v + 1
            return tag
        }
        promise
            .then(resolve)
            .then(resolve)

        await wait(100)
        expect(tag).toBe(3)
    })
})