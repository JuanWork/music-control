
const request = require('supertest');
const app = require('../../src/server-express');

describe('Contrato da API de Cursos', () => {
  test('Deve validar o contrato do curso ID 1 (Ecossistema Vimpank)', async () => {
    // 1. Faz a requisição
    const res = await request(app).get('/api/cursos/1');

    // 2. O básico: Sucesso na requisição
    expect(res.status).toBe(200);

    // 3. Validação da Estrutura (O Contrato Real)
    expect(res.body).toMatchObject({
      id: 1,
      titulo: "Ecossistema Vimpank",
      descricao: "Nossa miragem de sistema",
      autor: "Juan Carlos",
      edicao: "2ª Edição",

      // para o isbn, como pode ser null, usamos essa lógica:
      isbn_impresso: res.body.isbn_impresso === null ? null : expect.any(String),
      // para páginas, garantimos que seja um número.
      paginas: expect.any(Number)
    });

    // 4. Verificação específica de valores
    expect(res.body.paginas).toBe(400);
  });
});
