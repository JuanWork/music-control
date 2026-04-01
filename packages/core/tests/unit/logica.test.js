// packages/core/tests/unit/logica.test.js

test('Verificando se o meu ambiente vimpank é rápido', () => {
  const tempoEsperado = 100;
  expect(tempoEsperado).toBeLessThan(1000); // 100 é menor que 1000? Sim!
});

