
const { somatorio } = require ('../../src/algoritmos/02-loop-e-iteracao.js');

   test ('deve calcular o samtório de 1 até n', () =>{
    console.log(somatorio(3));
    console.log(somatorio(4));
    console.log(somatorio(5));

     // se n for 3: 1 + 2 + 3 = 6
     expect(somatorio(3)).toBe(6);
     // se n for 4: 1 + 2 + 3 + 4 = 10
     expect(somatorio(4)).toBe(10);
     // se n for 5: 1 + 2 + 3 + 4 + 5 = 15
     expect(somatorio(5)).toBe(15);
});
