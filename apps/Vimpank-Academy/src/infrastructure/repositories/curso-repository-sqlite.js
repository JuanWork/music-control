// infrastructure/repositories/curso-repository-sqlite.js
const { CursoRepository } = require('../../domain/curso-repository');

class CursoRepositorySqlite extends CursoRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  listar(filtros = {}) {
    let query = 'SELECT id, titulo, descricao FROM cursos';
    const params = [];
    if (filtros.q) {
      query += ' WHERE titulo LIKE ? OR descricao LIKE ?';
      params.push(`%${filtros.q}%`, `%${filtros.q}%`);
    }
    const sort = filtros.sort === 'titulo' ? 'titulo' : 'id';
    const order = filtros.order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sort} ${order}`;
    const page = Math.max(1, parseInt(filtros.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filtros.limit) || 10));
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    const rows = this.db.prepare(query).all(...params);
    // Contagem total
    let countQuery = 'SELECT COUNT(*) as total FROM cursos';
    const countParams = [];
    if (filtros.q) {
      countQuery += ' WHERE titulo LIKE ? OR descricao LIKE ?';
      countParams.push(`%${filtros.q}%`, `%${filtros.q}%`);
    }
    const total = this.db.prepare(countQuery).get(...countParams).total;
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: rows
    };
  }

  buscarPorId(id) {
    const row = this.db.prepare('SELECT id, titulo, descricao FROM cursos WHERE id = ?').get(id);
    return row || null;
  }

  criar(curso) {
    const stmt = this.db.prepare('INSERT INTO cursos (titulo, descricao) VALUES (?, ?)');
    const info = stmt.run(curso.titulo, curso.descricao);
    return { id: info.lastInsertRowid, ...curso };
  }

  atualizar(id, curso) {
    const stmt = this.db.prepare('UPDATE cursos SET titulo = ?, descricao = ? WHERE id = ?');
    const result = stmt.run(curso.titulo, curso.descricao, id);
    if (result.changes === 0) return null;
    return { id, ...curso };
  }

  deletar(id) {
    const stmt = this.db.prepare('DELETE FROM cursos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = { CursoRepositorySqlite };
