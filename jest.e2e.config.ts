import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', './src/index.ts', './src/scripts/'],
    coverageReporters: ["json", "lcov", "text", "clover", "text-summary", "cobertura"],
    coverageThreshold: {
        global: {
            "statements": 90,
            "branches": 80,
            "functions": 85,
            "lines": 90,
        }
    },
    globalTeardown: './test/teardown.ts',
    testSequencer: './test/sequencer.js',
    testTimeout: 50000,
};

export default config;
