const { z } = require('zod');
const { extendZodWithOpenApi } = require('@asteasolutions/zod-to-openapi');

// Estende o Zod com suporte a OpenAPI
extendZodWithOpenApi(z);

const CursoSchema = z.object({
  id: z.number().int().positive().openapi({ example: 1 }),
  titulo: z.string().trim().min(3).max(100).openapi({ example: 'JavaScript Avançado' }),
  descricao: z.string().trim().max(500).optional().default('').openapi({ example: 'Closures, prototypes e mais' }),
});

const CriarCursoSchema = CursoSchema.omit({ id: true });
const AtualizarCursoSchema = CriarCursoSchema.partial();

module.exports = { CursoSchema, CriarCursoSchema, AtualizarCursoSchema };
