const { z } = require('zod');
const { extendZodWithOpenApi } = require('@asteasolutions/zod-to-openapi');

// Estende o Zod com suporte a OpenAPI (necessário para o .register() funcionar)
extendZodWithOpenApi(z);

// Agora defina os schemas normalmente
const CursoSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string().trim().min(3).max(100),
  descricao: z.string().trim().max(500).optional().default(''),
});

const CriarCursoSchema = CursoSchema.omit({ id: true });
const AtualizarCursoSchema = CriarCursoSchema.partial();

module.exports = { CursoSchema, CriarCursoSchema, AtualizarCursoSchema };
