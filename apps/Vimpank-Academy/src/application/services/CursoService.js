const { Curso } = require('../../domain/curso/Curso');

class CursoService {
  constructor(cursoRepository) {
    this.cursoRepository = cursoRepository;
  }

  listar(filtros) {
    return this.cursoRepository.listar(filtros);
  }

  buscarPorId(id) {
    return this.cursoRepository.buscarPorId(id);
  }

  criar(dados) {
    // Validação completa dos campos obrigatórios
    const validacao = Curso.validar(
      dados.titulo,
      dados.descricao,
      dados.autor,
      dados.edicao
    );
    if (!validacao.valido) throw new Error(validacao.mensagem);

    const { titulo, descricao, autor, edicao } = validacao.dados;
    const { isbn_impresso, paginas } = dados;

    // Trava de ISBN único
    if (isbn_impresso) {
      const existeIsbn = this.cursoRepository.buscarPorIsbn(isbn_impresso);
      if (existeIsbn) throw new Error(`Conflito: O ISBN ${isbn_impresso} já está cadastrado.`);
    }

    // Trava de duplicidade (título + autor + edição)
    const duplicado = this.cursoRepository.existeIgual(titulo, autor, edicao);
    if (duplicado) {
      throw new Error('Este autor já possui este livro com a mesma edição cadastrada.');
    }

    const novoCurso = { titulo, descricao, autor, edicao, isbn_impresso, paginas };
    return this.cursoRepository.criar(novoCurso);
  }

  atualizar(id, dados) {
    // Prepara objeto para validação apenas dos campos presentes
    const dadosValidados = {};

    // Só valida titulo, descricao, autor, edicao se foram enviados
    if (dados.titulo !== undefined || dados.descricao !== undefined ||
        dados.autor !== undefined || dados.edicao !== undefined) {

      const validacao = Curso.validar(
        dados.titulo !== undefined ? dados.titulo : '',
        dados.descricao !== undefined ? dados.descricao : '',
        dados.autor !== undefined ? dados.autor : '',
        dados.edicao !== undefined ? dados.edicao : ''
      );
      if (!validacao.valido) throw new Error(validacao.mensagem);

      // Aplica sanitização apenas nos campos fornecidos
      if (dados.titulo !== undefined) dadosValidados.titulo = validacao.dados.titulo;
      if (dados.descricao !== undefined) dadosValidados.descricao = validacao.dados.descricao;
      if (dados.autor !== undefined) dadosValidados.autor = validacao.dados.autor;
      if (dados.edicao !== undefined) dadosValidados.edicao = validacao.dados.edicao;
    }

    // Adiciona campos opcionais que não precisam de validação do domínio
    if (dados.isbn_impresso !== undefined) dadosValidados.isbn_impresso = dados.isbn_impresso;
    if (dados.paginas !== undefined) dadosValidados.paginas = dados.paginas;

    // Verifica conflito de ISBN se estiver sendo atualizado
    if (dadosValidados.isbn_impresso) {
      const existeIsbn = this.cursoRepository.buscarPorIsbn(dadosValidados.isbn_impresso);
      if (existeIsbn && existeIsbn.id !== id) {
        throw new Error(`Conflito: O ISBN ${dadosValidados.isbn_impresso} já está cadastrado.`);
      }
    }

    const atualizado = this.cursoRepository.atualizar(id, dadosValidados);
    if (!atualizado) throw new Error('Curso não encontrado');
    return atualizado;
  }

  deletar(id) {
    const removido = this.cursoRepository.deletar(id);
    if (!removido) throw new Error('Curso não encontrado');
  }
}

module.exports = { CursoService };
