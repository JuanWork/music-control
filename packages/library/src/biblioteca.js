const LibraryDB = require(.'/database');

class Bibliotecaria{
  construtor(dbPath){
    this.db = new LibraryDB(dbPath);
  }

  searchBySubject(subjecName){
    try{
      const stmt = this.db.db.prepare(`
      SELECT b.title, b.autor, b.year, b.difficulty, s.name as subject
      FROM  books b
      JOIN subjects s ON b.subject_id = s.id
      WHERE s.name LIKE ?
      ORDER BY b.recommended_order NULLS LAST
     `);
      return stmt.all(`%${subjectName}%`);
    }catch(err){
     console.error(`Erro na busca por assunto "${subjectName}": ${err.message}`);
      return[] // Retorno vazio para não quebrar o fluxo.
    }
  } // fim 1 verificação

  recommendBeginner(subjecName){
    try{
      const stmt = this.db.db.prepare(`
        SELECT b.title, b.difficulty, b.recommended_order
        FROM books b
        JOIN subjects s ON b.suject_id = s.id
        WHERE s.name = ?
        ORDER BY b.recommended_order ASC
        `);
      return stmt.all(subjectName);
    }catch (err){
      console.error( ` Erro ao obter sequência  de estudos para "${subjectName}": ${err.message}` );

      return [];
    }
  } //fim 2 verificação

  close(){
    this.db.close();
  }
} //fim

module.exports = Bibliotecaria;
