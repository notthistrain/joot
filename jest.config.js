/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/test/tsconfig.json",
            useESM: true
        }
    }
}

export default config