// infrastructure/repositories/curso-repository-memory.js
const { CursoRepository } = require('../../domain/curso-repository');

class CursoRepositoryMemory extends CursoRepository {
  constructor(dadosIniciais = []) {
    super();
    this.cursos = dadosIniciais.map(c => ({ ...c }));
    this.nextId = this.cursos.length > 0 ? Math.max(...this.cursos.map(c => c.id)) + 1 : 1;
  }

  listar(filtros = {}) {
    let resultados = [...this.cursos];
    if (filtros.q) {
      const termo = filtros.q.toLowerCase();
      resultados = resultados.filter(c =>
        c.titulo.toLowerCase().includes(termo) ||
        (c.descricao && c.descricao.toLowerCase().includes(termo))
      );
    }
    const sort = filtros.sort === 'titulo' ? 'titulo' : 'id';
    const order = filtros.order === 'desc' ? -1 : 1;
    resultados.sort((a, b) => {
      if (sort === 'titulo') return order * a.titulo.localeCompare(b.titulo);
      return order * (a.id - b.id);
    });
    const page = Math.max(1, parseInt(filtros.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filtros.limit) || 10));
    const start = (page - 1) * limit;
    const paginated = resultados.slice(start, start + limit);
    return {
      total: resultados.length,
      page,
      limit,
      totalPages: Math.ceil(resultados.length / limit),
      data: paginated
    };
  }

  buscarPorId(id) {
    return this.cursos.find(c => c.id === id) || null;
  }

  criar(curso) {
    const novo = { id: this.nextId++, ...curso };
    this.cursos.push(novo);
    return novo;
  }

  atualizar(id, curso) {
    const index = this.cursos.findIndex(c => c.id === id);
    if (index === -1) return null;
    const atualizado = { ...this.cursos[index], ...curso };
    this.cursos[index] = atualizado;
    return atualizado;
  }

  deletar(id) {
    const index = this.cursos.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.cursos.splice(index, 1);
    return true;
  }
}

module.exports = { CursoRepositoryMemory };
