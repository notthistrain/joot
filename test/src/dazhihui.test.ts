describe("dazhihui test", () => {
    test("quchong", async () => {
        /** 
         * 对数组去重
         * [1, -1, 1] -> [1, -1]
         * [{a: 1, b: 1}, { b: 1, a:1}] -> [{a: 1, b:1}]
         * [[1], [2], [1]] -> [[1], [2]]
         */
        function is_same(origin: any, target: any) {
            let type_origin = typeof origin
            let type_target = typeof target
            if (type_origin !== 'object' && type_target !== "object") return origin === target
            if (origin === null || target === null) return target === origin

            let is_array_origin = Array.isArray(origin)
            let is_array_target = Array.isArray(origin)
            if (is_array_origin !== is_array_target) return false

            if (is_array_origin) {
                if (origin.length !== target.length) return false
                for (let i = 0; i < origin.length; i++) {
                    if (!is_same(origin[i], target[i])) {
                        return false
                    }
                }
            } else {
                let keys = Reflect.ownKeys(origin)
                for (const key of keys) {
                    if (!is_same(origin[key], target[key])) {
                        return false
                    }
                }
            }
            return true
        }
        function has(array: Array<any>, target: any) {
            for (const item of array) {
                if (is_same(item, target)) {
                    return true
                }
            }
            return false
        }
        function array_reduce_same(array: Array<any>) {
            let result: Array<any> = []
            for (let i = 0; i < array.length; i++) {
                let item = array[i]
                if (!has(result, item)) {
                    result.push(item)
                }
            }
            return result
        }
        expect(array_reduce_same([1, -1, 1])).toEqual([1, -1])
        expect(array_reduce_same([{ a: 1, b: 1 }, { b: 1, a: 1 }])).toEqual([{ a: 1, b: 1 }])
        expect(array_reduce_same([[1], [2], [1]])).toEqual([[1], [2]])
    })
})