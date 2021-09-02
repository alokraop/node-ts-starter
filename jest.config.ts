import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        './src/index.ts',
        './src/data/',
        './src/controllers/',
        './src/scripts/'
    ],
    coverageThreshold: {
        global: {
            statements: 90,
            branches: 80,
            functions: 90,
            lines: 90
        }
    },
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary', 'cobertura']
};

export default config;
