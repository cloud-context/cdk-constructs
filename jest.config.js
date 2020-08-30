module.exports = {
  //roots: ['<rootDir>\\packages'],
  testRegex: ['/test/.*\\.(test|spec)?\\.tsx?$'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverage: true,
  coverageReporters: ['cobertura', 'json', 'html', 'text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/lib/**/*.{ts,tsx,js,jsx}'
  ]
};
