const request = require('supertest');
const app = require('../src/server-express');

describe('API de Cursos (CRUD)', () => {
  // GET /api/cursos
  test('GET /api/cursos deve retornar 200 e array com 6 cursos', async () => {
    const res = await request(app).get('/api/cursos');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(6);
    expect(res.body[0]).toHaveProperty('titulo', 'JavaScript');
  });

  // GET /api/cursos/:id
  test('GET /api/cursos/2 retorna o curso HTML', async () => {
    const res = await request(app).get('/api/cursos/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('HTML');
  });

  test('GET /api/cursos/99 retorna 404', async () => {
    const res = await request(app).get('/api/cursos/99');
    expect(res.statusCode).toBe(404);
  });

  // POST /api/cursos
  test('POST /api/cursos cria novo curso com dados válidos', async () => {
    const novo = { titulo: 'Jest', descricao: 'Testes em JavaScript' };
    const res = await request(app).post('/api/cursos').send(novo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', 7);
    expect(res.body.titulo).toBe('Jest');
  });

  test('POST /api/cursos com título inválido (número) retorna 400', async () => {
    const res = await request(app).post('/api/cursos').send({ titulo: 123 });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toContain('Título deve ser texto');
  });

  // PUT /api/cursos/:id
  test('PUT /api/cursos/7 atualiza curso', async () => {
    const atualizado = { titulo: 'Jest Avançado', descricao: 'Mocking e spies' };
    const res = await request(app).put('/api/cursos/7').send(atualizado);
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Jest Avançado');
  });

  // DELETE /api/cursos/:id
  test('DELETE /api/cursos/7 remove curso', async () => {
    const res = await request(app).delete('/api/cursos/7');
    expect(res.statusCode).toBe(204);
  });

  // Verifica remoção
  test('GET /api/cursos após DELETE deve ter 6 cursos novamente', async () => {
    const res = await request(app).get('/api/cursos');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(6);
    expect(res.body.find(c => c.id === 7)).toBeUndefined();
  });
});
