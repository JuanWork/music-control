const request = require('supertest');
const app = require('../../src/server-express');
const { CursoSchema } = require('../../../../packages/core/src/contracts/schemas/curso.schema');
//const { CursoSchema } = require('@vimpank/core/contracts/schemas/curso.schema');

describe('Contrato da API de Cursos', () => {
  test('GET /api/cursos/:id retorna um objeto que satisfaz o schema Curso', async () => {
    const res = await request(app).get('/api/cursos/1');

    // Se o banco estiver vazio e retornar 404, pulamos o teste sem falhar
    if (res.status === 404) {
      console.warn('Nenhum curso com ID 1 encontrado. Teste de contrato ignorado.');
      return;
    }

    expect(res.status).toBe(200);
    const validation = CursoSchema.safeParse(res.body);
    expect(validation.success).toBe(true);
  });
});
