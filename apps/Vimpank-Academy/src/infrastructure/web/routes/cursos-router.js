// infrastructure/web/routes/cursos-router.js
const express = require('express');
const router = express.Router();

function cursosRouter(cursoService) {
  router.get('/', (req, res) => {
    try {
      const { q, sort, order, page, limit } = req.query;
      const resultado = cursoService.listar({ q, sort, order, page, limit });
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });

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

  router.post('/', (req, res) => {
    try {
      const novo = cursoService.criar(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  });

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
