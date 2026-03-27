const Control = require('../src/control-trinha');
const cor = { azul: '\x1b[36m', verde: '\x1b[32m', reset: '\x1b[0m' };

async function executar(nome, acao) {
  console.log(`${cor.azul}🧪 Testando: ${nome}${cor.reset}`);
  try {
    const r = await acao();
    console.log(`${cor.verde}✅ OK ${r ? '('+r+')' : ''}${cor.reset}\n`);
  } catch (e) {
    console.log(`❌ Erro: ${e.message}\n`);
  }
}

async function trinha() {
  console.log('🎵 INICIANDO TRINHA DE TESTES...\n');
  await executar('1. Play/Pause', () => Control.playPause());
  await executar('2. Próxima', () => Control.next());
  await executar('3. Anterior', () => Control.previous());
  await executar('4. + Volume', () => Control.volumeUp());
  await executar('5. - Volume', () => Control.volumeDown());
  
  const atual = await Control.current();
  await executar('6. Música Atual', () => console.log('   📻:', atual || 'Nada'));
  
  console.log('🎉 TRINHA FINALIZADA!');
}

trinha();
