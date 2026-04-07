module.exports = {
 // projects: [
  //  "<rootDir>/packages/*",
  //  "<rootDir>/apps/*"
  // ],

  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],


  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },


  testEnvironment: 'node',


  coverageReporters: ['text', 'html'],


  testPathIgnorePatterns: ['/node_modules/'],


  transform: {},
  transformIgnorePatterns: ['/node_modules/']
};
