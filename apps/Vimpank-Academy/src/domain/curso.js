// domain/curso.js - Entidade e regras de negócio

const sanitizar = (entrada) => {
  if (typeof entrada !== 'string') return '';
  return entrada.replace(/[^a-zA-Z0-9 áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ.,!?()-]/g, '');
};

class Curso {
  constructor(id, titulo, descricao) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
  }

  static validar(titulo, descricao) {
    if (typeof titulo !== 'string') {
      return { valido: false, mensagem: 'Título deve ser texto' };
    }
    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length < 3 || tituloLimpo.length > 100) {
      return { valido: false, mensagem: 'Título deve ter entre 3 e 100 caracteres' };
    }
    // A descrição é opcional, mas se fornecida deve ser string
    if (descricao !== undefined && typeof descricao !== 'string') {
      return { valido: false, mensagem: 'Descrição deve ser texto' };
    }
    const descricaoLimpa = descricao ? descricao.trim() : '';
    if (descricaoLimpa.length > 500) {
      return { valido: false, mensagem: 'Descrição deve ter no máximo 500 caracteres' };
    }
    return {
      valido: true,
      dados: {
        titulo: sanitizar(tituloLimpo),
        descricao: sanitizar(descricaoLimpa)
      }
    };
  }
}

module.exports = { Curso, sanitizar };
