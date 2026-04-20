const { z } = require('zod');

const UsuarioSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(100),
  senha: z.string().min(6).max(255),
  role: z.enum(['admin', 'user']).default('user'),
  criadoEm: z.date().optional()
});

const CriarUsuarioSchema = UsuarioSchema.omit({ id: true, criadoEm: true });
const LoginSchema = UsuarioSchema.pick({ email: true, senha: true });

module.exports = { UsuarioSchema, CriarUsuarioSchema, LoginSchema };
