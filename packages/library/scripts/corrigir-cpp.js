const Database = require('better-sqlite3');
const DB_PATH = '/mnt/armazenamento/mastercode/database/library.db';

const db = new Database(DB_PATH);

try {
    // Comando para mudar o nome da categoria de 'cpp' para o novo padrão
    const stmt = db.prepare("UPDATE biblioteca SET categoria = ? WHERE categoria = ?");
    const result = stmt.run('Linguagem C/C++', 'cpp');

    console.log(`✅ Sucesso! ${result.changes} livros foram atualizados para 'Linguagem C/C++'.`);
} catch (err) {
    console.error("❌ Erro ao atualizar:", err.message);
} finally {
    db.close();
}

