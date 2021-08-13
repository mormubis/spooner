module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.{ts,tsx}'],
  verbose: true,
};
