const bcrypt = require('bcrypt');

class Usuario {
  constructor(id, nome, email, senhaHash, role = 'user', criadoEm = new Date()) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senhaHash = senhaHash;
    this.role = role;
    this.criadoEm = criadoEm;
  }

  static async hashSenha(senha) {
    return bcrypt.hash(senha, 10);
  }

  async verificarSenha(senha) {
    return bcrypt.compare(senha, this.senhaHash);
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      role: this.role,
      criadoEm: this.criadoEm
    };
  }
}

module.exports = { Usuario };
