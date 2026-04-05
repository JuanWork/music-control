module.exports = {
  // Define os projetos (workspaces) que o Jest deve executar
  projects: ['<rootDir>/packages/*', '<rootDir>/apps/*'],

  // Coleta cobertura de todos os arquivos .js dentro de src/
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Cobertura mínima exigida (opcional, mas profissional)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Ambiente de teste (Node.js)
  testEnvironment: 'node',

  // Exibe relatório de cobertura no console
  coverageReporters: ['text', 'html'],

  // Ignora pastas de node_modules e outras irrelevantes
  testPathIgnorePatterns: ['/node_modules/'],

  // Transforma arquivos .js com babel (se precisar, instale @babel/preset-env e babel-jest)
  // Se não usar Babel, pode remover esta seção
  transform: {},
  transformIgnorePatterns: ['/node_modules/']
};
