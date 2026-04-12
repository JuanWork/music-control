// application/curso-service.js
const { Curso } = require('../domain/curso');

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
    const validacao = Curso.validar(dados.titulo, dados.descricao);
    if (!validacao.valido) throw new Error(validacao.mensagem);
    const { titulo, descricao } = validacao.dados;
    const novoCurso = { titulo, descricao };
    return this.cursoRepository.criar(novoCurso);
  }

  atualizar(id, dados) {
    const validacao = Curso.validar(dados.titulo, dados.descricao);
    if (!validacao.valido) throw new Error(validacao.mensagem);
    const { titulo, descricao } = validacao.dados;
    const atualizado = this.cursoRepository.atualizar(id, { titulo, descricao });
    if (!atualizado) throw new Error('Curso não encontrado');
    return atualizado;
  }

  deletar(id) {
    const removido = this.cursoRepository.deletar(id);
    if (!removido) throw new Error('Curso não encontrado');
  }
}

module.exports = { CursoService };
