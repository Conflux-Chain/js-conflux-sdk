module.exports = {
  bail: true,

  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['html'],

  testEnvironment: 'node',
  testMatch: ['./**/**.test.js'],
};
