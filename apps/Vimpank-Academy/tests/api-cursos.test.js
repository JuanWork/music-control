const request = require('supertest');
const express = require('express');
const { CursoRepositoryMemory } = require('../src/infrastructure/repositories/curso-repository-memory');
const { CursoService } = require('../src/application/curso-service');
const { cursosRouter } = require('../src/infrastructure/web/routes/cursos-router');

// Dados iniciais (os 6 cursos esperados pelos testes)
const dadosIniciais = [
  { id: 1, titulo: 'JavaScript', descricao: 'Fundamentos e avançado' },
  { id: 2, titulo: 'HTML', descricao: 'Estrutura semântica' },
  { id: 3, titulo: 'CSS', descricao: 'Estilização e layout' },
  { id: 4, titulo: 'Node.js', descricao: 'Backend com JavaScript' },
  { id: 5, titulo: 'TypeScript', descricao: 'Tipagem estática' },
  { id: 6, titulo: 'SQLite3', descricao: 'Banco de dados relacional' }
];

function createTestApp() {
  const app = express();
  app.use(express.json());
  const repository = new CursoRepositoryMemory(dadosIniciais);
  const service = new CursoService(repository);
  app.use('/api/cursos', cursosRouter(service));
  return app;
}

describe('API de Cursos (CRUD + Busca/Ordenação/Paginação)', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('GET /api/cursos deve retornar objeto paginado com 6 cursos', async () => {
    const res = await request(app).get('/api/cursos');
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(6);
    expect(res.body.data).toHaveLength(6);
  });

  test('GET /api/cursos?page=2&limit=2 deve paginar corretamente', async () => {
    const res = await request(app).get('/api/cursos?page=2&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].id).toBe(3);
  });

  test('GET /api/cursos?q=java deve buscar cursos com "java"', async () => {
    const res = await request(app).get('/api/cursos?q=java');
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.data[0].titulo).toBe('JavaScript');
    expect(res.body.data[1].titulo).toBe('Node.js');
  });

  test('GET /api/cursos?sort=titulo&order=asc ordena por título ascendente', async () => {
    const res = await request(app).get('/api/cursos?sort=titulo&order=asc');
    expect(res.statusCode).toBe(200);
    const titulos = res.body.data.map(c => c.titulo);
    expect(titulos).toEqual(['CSS', 'HTML', 'JavaScript', 'Node.js', 'SQLite3', 'TypeScript']);
  });

  test('GET /api/cursos/2 retorna curso HTML', async () => {
    const res = await request(app).get('/api/cursos/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('HTML');
  });

  test('GET /api/cursos/99 retorna 404', async () => {
    const res = await request(app).get('/api/cursos/99');
    expect(res.statusCode).toBe(404);
  });

  // Teste de criação: verifica que o ID é maior que 6
  test('POST /api/cursos cria novo curso com dados válidos', async () => {
    const novo = { titulo: 'Jest', descricao: 'Testes em JavaScript' };
    const res = await request(app).post('/api/cursos').send(novo);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeGreaterThan(6);
    expect(res.body.titulo).toBe('Jest');
  });

  test('POST /api/cursos com título inválido (número) retorna 400', async () => {
    const res = await request(app).post('/api/cursos').send({ titulo: 123 });
    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toContain('Título deve ser texto');
  });

  // Teste de atualização: cria um curso, atualiza e verifica
  test('PUT /api/cursos atualiza curso existente', async () => {
    // Primeiro cria um curso
    const novo = { titulo: 'Temporario', descricao: 'Para teste' };
    const createRes = await request(app).post('/api/cursos').send(novo);
    const id = createRes.body.id;

    const atualizado = { titulo: 'Atualizado', descricao: 'Nova descrição' };
    const putRes = await request(app).put(`/api/cursos/${id}`).send(atualizado);
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.titulo).toBe('Atualizado');
  });

  test('PUT /api/cursos com ID inexistente retorna 404', async () => {
    const atualizado = { titulo: 'Qualquer', descricao: 'Teste' };
    const res = await request(app).put('/api/cursos/999').send(atualizado);
    expect(res.statusCode).toBe(404);
  });

  // Teste de deleção: cria um curso e deleta
  test('DELETE /api/cursos remove curso existente', async () => {
    const novo = { titulo: 'ParaDeletar', descricao: 'Será removido' };
    const createRes = await request(app).post('/api/cursos').send(novo);
    const id = createRes.body.id;

    const delRes = await request(app).delete(`/api/cursos/${id}`);
    expect(delRes.statusCode).toBe(204);

    // Verifica que não existe mais
    const getRes = await request(app).get(`/api/cursos/${id}`);
    expect(getRes.statusCode).toBe(404);
  });

  test('DELETE /api/cursos com ID inexistente retorna 404', async () => {
    const res = await request(app).delete('/api/cursos/999');
    expect(res.statusCode).toBe(404);
  });
});
