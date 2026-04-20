const { CursoRepository } = require('../../domain/curso/CursoRepository');

class CursoRepositorySqlite extends CursoRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  listar(filtros = {}) {
    let query = 'SELECT * FROM cursos WHERE 1=1';
    const params = [];

    if (filtros.q) {
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR autor LIKE ?)';
      const termo = `%${filtros.q}%`;
      params.push(termo, termo, termo);
    }

    if (filtros.autor) {
      query += ' AND autor LIKE ?';
      params.push(`%${filtros.autor}%`);
    }

    if (filtros.isbn) {
      query += ' AND isbn_impresso LIKE ?';
      params.push(`%${filtros.isbn}%`);
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

    let countQuery = 'SELECT COUNT(*) as total FROM cursos WHERE 1=1';
    const countParams = [];

    if (filtros.q) {
      countQuery += ' AND (titulo LIKE ? OR descricao LIKE ? OR autor LIKE ?)';
      const termo = `%${filtros.q}%`;
      countParams.push(termo, termo, termo);
    }

    if (filtros.autor) {
      countQuery += ' AND autor LIKE ?';
      countParams.push(`%${filtros.autor}%`);
    }

    if (filtros.isbn) {
      countQuery += ' AND isbn_impresso LIKE ?';
      countParams.push(`%${filtros.isbn}%`);
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
    const row = this.db.prepare('SELECT * FROM cursos WHERE id = ?').get(id);
    return row || null;
  }

  buscarPorIsbn(isbn) {
    if (!isbn) return null;
    const row = this.db.prepare('SELECT * FROM cursos WHERE isbn_impresso = ?').get(isbn);
    return row || null;
  }

  existeIgual(titulo, autor, edicao) {
    const row = this.db.prepare(
      'SELECT id FROM cursos WHERE titulo = ? AND autor = ? AND edicao = ?'
    ).get(titulo, autor, edicao);
    return !!row;
  }

  criar(curso) {
    const stmt = this.db.prepare(
      'INSERT INTO cursos (titulo, descricao, autor, edicao, isbn_impresso, paginas) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(
      curso.titulo,
      curso.descricao,
      curso.autor,
      curso.edicao,
      curso.isbn_impresso,
      curso.paginas
    );
    return { id: info.lastInsertRowid, ...curso };
  }

  // 🆕 Método de atualização DINÂMICO (só mexe nos campos enviados)
  atualizar(id, dados) {
    if (Object.keys(dados).length === 0) {
      return this.buscarPorId(id);
    }

    const campos = [];
    const valores = [];

    for (const [campo, valor] of Object.entries(dados)) {
      if (valor !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(valor);
      }
    }

    if (campos.length === 0) {
      return this.buscarPorId(id);
    }

    valores.push(id);
    const sql = `UPDATE cursos SET ${campos.join(', ')} WHERE id = ?`;

    const stmt = this.db.prepare(sql);
    const result = stmt.run(...valores);

    if (result.changes === 0) return null;
    return this.buscarPorId(id);
  }

  deletar(id) {
    const stmt = this.db.prepare('DELETE FROM cursos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = { CursoRepositorySqlite };
