module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testMatch: ['**/*.spec.{ts,tsx}'],
  verbose: true,
};