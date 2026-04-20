const express = require('express');
const router = express.Router();

function cursosRouter(cursoService) {

  // Rota GET / (Listar com todos os filtros)
  router.get('/', (req, res) => {
    try {
      const { q, autor, isbn, sort, order, page, limit } = req.query;
      const resultado = cursoService.listar({ q, autor, isbn, sort, order, page, limit });
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });

  // Rota GET /:id (Buscar por ID)
  router.get('/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
      const curso = cursoService.buscarPorId(id);
      if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
      res.json(curso);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });

  // Rota POST / (Criar)
  router.post('/', (req, res) => {
    try {
      const novo = cursoService.criar(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  });

  // Rota PUT /:id (Atualizar)
  router.put('/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
      const atualizado = cursoService.atualizar(id, req.body);
      res.json(atualizado);
    } catch (err) {
      if (err.message === 'Curso não encontrado') return res.status(404).json({ erro: err.message });
      res.status(400).json({ erro: err.message });
    }
  });

  // Rota DELETE /:id (Remover)
  router.delete('/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
      cursoService.deletar(id);
      res.status(204).send();
    } catch (err) {
      if (err.message === 'Curso não encontrado') return res.status(404).json({ erro: err.message });
      res.status(500).json({ erro: err.message });
    }
  });

  return router;
}

module.exports = { cursosRouter };
