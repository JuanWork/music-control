const LibraryDB = require('../../src/database');

describe('LibraryDB',() => {
  let db;

  beforeAll(() => {
    // Usa banco em memória para testes (não persiste)
    db = new LibraryDB(':memory:');
  });

  afterAll(() => {
    if (db && db.close) db.close();
  });

  test('deve inicialzar as tabelas',() => {
    const tables = db.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    expect(tableNames).toContain('subjects');
    expect(tableNames).toContain('books');
  });
});
