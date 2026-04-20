const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { OpenAPIRegistry, OpenApiGeneratorV3 } = require('@asteasolutions/zod-to-openapi');

// Importar os schemas
const schemaPath = path.join(__dirname, '../packages/core/src/contracts/schemas/curso.schema.js');
const { CursoSchema, CriarCursoSchema, AtualizarCursoSchema } = require(schemaPath);

const registry = new OpenAPIRegistry();

// Registrar schemas
registry.register('Curso', CursoSchema);
registry.register('CriarCurso', CriarCursoSchema);
registry.register('AtualizarCurso', AtualizarCursoSchema);

// Registrar paths manualmente (para documentar as rotas)
registry.registerPath({
  method: 'get',
  path: '/cursos',
  summary: 'Listar cursos',
  tags: ['Cursos'],
  parameters: [
    { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Termo de busca' },
    { name: 'sort', in: 'query', schema: { type: 'string', enum: ['id', 'titulo'] } },
    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
    { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50 } }
  ],
  responses: {
    200: {
      description: 'Lista paginada de cursos',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
              data: { type: 'array', items: { $ref: '#/components/schemas/Curso' } }
            }
          }
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/cursos/{id}',
  summary: 'Buscar curso por ID',
  tags: ['Cursos'],
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
  ],
  responses: {
    200: { description: 'Curso encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Curso' } } } },
    404: { description: 'Curso não encontrado' }
  }
});

registry.registerPath({
  method: 'post',
  path: '/cursos',
  summary: 'Criar novo curso',
  tags: ['Cursos'],
  requestBody: {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/CriarCurso' } } }
  },
  responses: {
    201: { description: 'Curso criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Curso' } } } },
    400: { description: 'Dados inválidos' }
  }
});

registry.registerPath({
  method: 'put',
  path: '/cursos/{id}',
  summary: 'Atualizar curso',
  tags: ['Cursos'],
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
  ],
  requestBody: {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/AtualizarCurso' } } }
  },
  responses: {
    200: { description: 'Curso atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Curso' } } } },
    400: { description: 'Dados inválidos' },
    404: { description: 'Curso não encontrado' }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/cursos/{id}',
  summary: 'Remover curso',
  tags: ['Cursos'],
  parameters: [
    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
  ],
  responses: {
    204: { description: 'Curso removido' },
    404: { description: 'Curso não encontrado' }
  }
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Vimpank Academy API',
    version: '1.0.0',
    description: 'API do ecossistema VimAcademe – Cursos, Atores, Lições',
  },
  servers: [{ url: 'http://localhost:3000/api', description: 'Servidor local' }],
});

const outputPath = path.join(__dirname, '../packages/core/src/contracts/api/openapi.yaml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, yaml.stringify(document));

console.log('✅ openapi.yaml gerado com sucesso (incluindo paths)!');
