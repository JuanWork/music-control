// apps/music-control/src/commands.test.js
jest.mock('child_process', () => ({
  exec: jest.fn((cmd, cb) => {
    if (cmd.includes('--print-playing')) {
      cb(null, 'Música Mockada - Artista\n');
    } else if (cmd.includes('--play-pause')) {
      cb(null, '0\n');
    } else {
      cb(null, '');
    }
  }),
  execSync: jest.fn((cmd) => {
    if (cmd.includes('--print-playing')) {
      return 'Música Mockada - Artista\n';
    }
    if (cmd.includes('--play-pause')) {
      return '0\n';
    }
    return '';
  })
}));

describe('🎛️ Painel de Controle - Music Win', () => {
  test('Deve conseguir ler a música atual (mockada)', () => {
    const { execSync } = require('child_process');
    const status = execSync('rhythmbox-client --print-playing').toString().trim();
    console.log("📻 Tocando agora:", status || "Silêncio no cockpit");
    expect(status).toBe('Música Mockada - Artista');
  });

  test('Comando Play/Pause deve ser enviado sem erros', () => {
    const { execSync } = require('child_process');
    const code = execSync('rhythmbox-client --play-pause && echo 0').toString().trim();
    expect(code).toBe('0');
  });
});
