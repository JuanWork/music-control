
const sanitizar = (entrada) => {
  if (typeof entrada !== 'string') return '';
  // Sua regex excelente que respeita nossa acentuação
  return entrada.replace(/[^a-zA-Z0-9 áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ.,!?()-]/g, '');
};

class Curso {
  // 1. Construtor agora preparado para os dados da garimpagem
  constructor(id, titulo, descricao, autor, edicao) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.autor = autor;
    this.edicao = edicao;
  }

  static validar(titulo, descricao, autor, edicao) {
    // Validação de Título
    if (typeof titulo !== 'string') {
      return { valido: false, mensagem: 'Título deve ser texto' };
    }
    const tituloLimpo = titulo.trim();
    if (tituloLimpo.length < 3 || tituloLimpo.length > 100) {
      return { valido: false, mensagem: 'Título deve ter entre 3 e 100 caracteres' };
    }

    // Validação de Descrição (opcional)
    const descricaoLimpa = descricao ? descricao.trim() : '';
    if (descricaoLimpa.length > 500) {
      return { valido: false, mensagem: 'Descrição deve ter no máximo 500 caracteres' };
    }

    // 2. Validação da Garimpagem (Autor e Edição)
    // Se não encontrar na garimpagem, definimos um padrão seguro
    const autorLimpo = autor ? autor.trim() : 'Autor Desconhecido';
    const edicaoLimpa = edicao ? edicao.trim() : '1ª Edição';

    return {
      valido: true,
      dados: {
        titulo: sanitizar(tituloLimpo),
        descricao: sanitizar(descricaoLimpa),
        autor: sanitizar(autorLimpo),
        edicao: sanitizar(edicaoLimpa)
      }
    };
  }
}

module.exports = { Curso, sanitizar };
