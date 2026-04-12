const request = require('supertest');
const app = require('../src/server-express');

describe('Vimpank Academy - Teste de Integração', () => {
  // Teste da Rota Raiz
  test('GET / deve retornar página inicial com título Vimpank Academy', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('🎵 Vimpank Academy');
    expect(res.text).toContain('API funcionando com Clean Architecture');
  });

  // Teste da Rota Sobre
  test('GET /sobre deve carregar a página sobre', async () => {
    const res = await request(app).get('/sobre');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('API com separação de responsabilidades');
    expect(res.text).toContain('Domain, Application, Infrastructure');
  });

  // Teste de Segurança (Rota inexistente)
  test('GET /hack-tentativa deve retornar 404', async () => {
    const res = await request(app).get('/hack-tentativa');
    expect(res.statusCode).toBe(404);
  });
});
