// apps/music-control/src/resgate.test.js
const motor = require('./control-trinha.js');

describe('Resgate Vimpank - Motor Trinha', () => {
  let fsSpy, consoleSpy;

  beforeAll(() => {
    // Mock do fs e console para evitar logs e escrita em disco
    const fs = require('fs');
    fsSpy = jest.spyOn(fs, 'appendFileSync').mockImplementation(() => {});
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    fsSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('O motor deve ser carregado', () => {
    expect(motor).toBeDefined();
    expect(['function', 'object']).toContain(typeof motor);
  });

  test('Deve expor os métodos principais de controle', () => {
    const metodosEsperados = [
      'playPause',
      'next',
      'previous',
      'volumeUp',
      'volumeDown',
      'current'
    ];
    metodosEsperados.forEach(metodo => {
      expect(typeof motor[metodo]).toBe('function');
    });
  });

  test('O método current deve retornar uma Promise (sem efeitos colaterais)', async () => {
    const promise = motor.current();
    expect(promise).toBeInstanceOf(Promise);
    // Aguarda a Promise para que não fique pendente após o teste
    await promise;
  });
});
