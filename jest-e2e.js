/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/tests/**/*.e2e-spec.ts'],
  setupFiles: ['<rootDir>/src/tests/config/setup-env-variables.ts', '<rootDir>/src/tests/config/global-mocks.ts'],
  globalSetup: '<rootDir>/src/tests/config/migrate-db.ts',
  globalTeardown: '<rootDir>/src/tests/config/clear-db.ts',
  coveragePathIgnorePatterns: ['<rootDir>/src/tests/'],
}
