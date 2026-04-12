const { DB_PATH } = require('./config');
const Database = require('better-sqlite3');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  try {
    console.log('📝 Cadastro manual de livro na biblioteca\n');
    const autor = await question('Autor principal: ');
    const edicao = await question('Edição (ex: 1ª Edição): ');
    const categoria = await question('Categoria (ex: Algoritmos): ');
    const caminho = await question('Caminho completo do arquivo PDF: ');
    const paginas = await question('Número de páginas (opcional, Enter para pular): ');
    const isbn = await question('ISBN impresso (opcional): ');

    const db = new Database(DB_PATH);
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO biblioteca 
      (autor_principal, edicao, categoria, caminho_arquivo, paginas, isbn_impresso)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      autor, edicao, categoria, caminho,
      paginas ? parseInt(paginas) : null,
      isbn || null
    );

    if (result.changes > 0) {
      console.log('✅ Livro inserido com sucesso!');
    } else {
      console.log('⚠️ Livro já existente (caminho duplicado) ou erro.');
    }
    db.close();
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    rl.close();
  }
}

main();
