module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['html'],

  testEnvironment: 'node',
  testMatch: ['./**/**.test.js'],
  transform: { '\\.js$': './development/esm-jest-transformer.js' },
};
