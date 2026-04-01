// /packages/core/tests/unit/aspect.test.js
const { saudar } = require('../../src/index');

describe('Testes do Módulo Core', () => {
  
  test('Deve retornar a saudação correta para o nome Juan', () => {
    const resultado = saudar('Juan');
    expect(resultado).toBe('Olá, Juan! Bem-vindo ao ecossistema Vimpank.');
  });

  test('Deve retornar saudação de visitante quando o nome for vazio', () => {
    const resultado = saudar();
    expect(resultado).toBe('Olá, Visitante!');
  });

});
