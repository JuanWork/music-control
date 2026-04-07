// Arquivo server-express.test.js
// 1. Importação iniciais - cabeçalho

const request = require('supertest');
const app = require ('../src/server-express');

// 2. O bloco de descrição(O que estamos testando):

describe ('Vimpank Academy - Teste de Integração', () => {
  // Teste da Rota Home
  it ('GET / deve retornar boas-vindas com nome sanitizado', async() => {
    const nomeSujeito = 'Juan<script>';
    const res = await request(app).get(`/?nome=${nomeSujeito}`);

     expect(res.statusCode).toBe(200);
     // Verificamos se o <script> foi removido pela sua função
     expect(res.text).toContain('Bem-vindo, <strong>Juanscript</strong>!')
  });

  // Teste da Rota sobre
  it ('GET /sobr deve carregar a página sobre', async () =>{
    const res = await request(app).get('/sobre');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Sobre a Vimpank');
  });

  // Teste de Segurança (Rota inexistente)
  it ('Deve retornar 404 para páginas que não exitem',async () => {
    const res = await request(app).get('/hack-tentativa');
    expect(res.statusCode).toBe(404);
  });
});
