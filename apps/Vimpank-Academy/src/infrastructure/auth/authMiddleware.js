function authMiddleware(authService) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ erro: 'Formato de token inválido' });
    }

    const token = parts[1];
    try {
      const payload = authService.verificarToken(token);
      req.usuario = payload; // Adiciona os dados do usuário na requisição
      next();
    } catch (err) {
      return res.status(401).json({ erro: err.message });
    }
  };
}

module.exports = { authMiddleware };
