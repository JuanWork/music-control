const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class LibraryDB{
  constructor(dbPath = '/mnt/armazenamento/mastercode/database/library.db'){
    try{
      //Garante que o diretório existe
      const dir = path.dirname(dbPath);
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Diretório criado: ${dir}`);
      } // Continuando com a lógica do try

      this.db = new Database(dbPath);
      this.db.pragma('foreign_keys = ON');
			console.log(`🟢conectado ao banco: ${dbPath}`);
			this.init();
  }catch(err){
	// Log humanizado
   console.error(`🔴 Nó crítico: Não foi possível conectar ao banco de dados. `);
	 console.error(` Motivo: ${err.message}`);
	 console.error(` Caminho tentado: ${dbPath}`);
   console.error(` 🧬 "Ei Linux, me ajuda a resolver essa permissão?"`);
	 throw err;
  }
}

  init(){
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS subjects(
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        category TEXT
      );
      CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        year INTEGER,
        path TEXT,
        difficulty INTEGER,
        recommended_order INTEGER,
        subject_id INTEGER,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
      );
			CREATE TABLE IF NOT EXISTS book_relations(
			book_id INTEGER,
			related_id INTEGER,
	    relation_type TEXT,
			PRIMARY KEY (book_id, related_id)
      );
    `);
    console.log('📚 Biblioteca Inicializada com sucesso(tabelas OK)');

  }//fim
  close(){
    this.db.close();
		console.log(' conexão com o banco fechada.')
  }
} //fim

module.exports = LibraryDB;
