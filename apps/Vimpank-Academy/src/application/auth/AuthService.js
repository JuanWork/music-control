const jwt = require('jsonwebtoken');
const { Usuario } = require('../../domain/usuario/Usuario');
const { CriarUsuarioSchema } = require('../../../../../packages/core/src/contracts/schemas/usuario.schema');

// Em produção, use variável de ambiente!
const JWT_SECRET = 'vimpank-secret-key-change-in-production';

class AuthService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async registrar(dados) {
    // Validação com Zod
    const validacao = CriarUsuarioSchema.safeParse(dados);
    if (!validacao.success) {
      throw new Error(`Dados inválidos: ${validacao.error.message}`);
    }

    const { nome, email, senha, role } = validacao.data;

    // Verifica se email já existe
    const existente = await this.usuarioRepository.buscarPorEmail(email);
    if (existente) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await Usuario.hashSenha(senha);

    // Cria usuário
    const usuario = new Usuario(null, nome, email, senhaHash, role || 'user');
    const salvo = await this.usuarioRepository.criar(usuario);

    // Retorna sem a senha
    return salvo.toJSON();
  }

  async login(email, senha) {
    const usuario = await this.usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await usuario.verificarSenha(senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      usuario: usuario.toJSON(),
      token
    };
  }

  verificarToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = { AuthService };
