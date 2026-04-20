const express = require('express');

function authRouter(authService) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const usuario = await authService.registrar(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }
      const resultado = await authService.login(email, senha);
      res.json(resultado);
    } catch (err) {
      res.status(401).json({ erro: err.message });
    }
  });

  return router;
}

module.exports = { authRouter };
