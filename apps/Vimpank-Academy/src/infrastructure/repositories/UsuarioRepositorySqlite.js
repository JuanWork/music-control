const { UsuarioRepository } = require('../../domain/usuario/UsuarioRepository');
const { Usuario } = require('../../domain/usuario/Usuario');

class UsuarioRepositorySqlite extends UsuarioRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  criar(usuario) {
    const stmt = this.db.prepare(`
      INSERT INTO usuarios (nome, email, senha_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(usuario.nome, usuario.email, usuario.senhaHash, usuario.role);
    usuario.id = info.lastInsertRowid;
    return usuario;
  }

  buscarPorEmail(email) {
    const row = this.db.prepare(`
      SELECT id, nome, email, senha_hash, role, criado_em
      FROM usuarios WHERE email = ?
    `).get(email);
    
    if (!row) return null;
    
    return new Usuario(
      row.id,
      row.nome,
      row.email,
      row.senha_hash,
      row.role,
      new Date(row.criado_em)
    );
  }

  buscarPorId(id) {
    const row = this.db.prepare(`
      SELECT id, nome, email, senha_hash, role, criado_em
      FROM usuarios WHERE id = ?
    `).get(id);
    
    if (!row) return null;
    
    return new Usuario(
      row.id,
      row.nome,
      row.email,
      row.senha_hash,
      row.role,
      new Date(row.criado_em)
    );
  }

  listar() {
    const rows = this.db.prepare(`
      SELECT id, nome, email, role, criado_em FROM usuarios
    `).all();
    return rows;
  }
}

module.exports = { UsuarioRepositorySqlite };
