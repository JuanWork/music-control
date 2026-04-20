// Eu busco a função que já existe no src
const { contarAteCinco } = require('../../src/algoritmos/01-loop-e-iteracao.js');

test( 'deve retornar um array de 1 a 5', () => {
  const esperado = [1, 2, 3, 4, 5];
  const resultado = contarAteCinco();

  // toEqual é usado para comparar arrays/objetos
  expect(resultado).toEqual(esperado);
  expect(resultado.length).toBe(5);

});

