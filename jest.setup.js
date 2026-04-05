// jest.setup.js
// Mock global do child_process para todos os testes
jest.mock('child_process', () => ({
  exec: jest.fn((cmd, cb) => {
    if (cmd.includes('--print-playing')) {
      cb(null, 'Música Mock Global\n');
    } else if (cmd.includes('--play-pause')) {
      cb(null, '0\n');
    } else {
      cb(null, '');
    }
  }),
  execSync: jest.fn((cmd) => {
    if (cmd.includes('--print-playing')) {
      return 'Música Mock Global\n';
    }
    if (cmd.includes('--play-pause')) {
      return '0\n';
    }
    return '';
  })
}));

module.exports = {
  projects: ['<rootDir>/packages/*', '<rootDir>/apps/*'],
  collectCoverageFrom: ['**/src/**/*.js', '!**/node_modules/**', '!**/tests/**'],
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
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']  // Adicione esta linha
};
