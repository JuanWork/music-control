const fs = require('fs');
const logPath = '/mnt/armazenamento/mastercode/database/vimpank.log';

function logEvent(type) {
  // Não escreve no disco durante os testes
  if (process.env.NODE_ENV === 'test') {
    console.log(`[TEST] Registrado: ${type}`);
    return;
  }
  const entry = `${new Date().toISOString()} - ${type}\n`;
  fs.appendFileSync(logPath, entry);
  console.log(`Registrado: ${type}`);
}

if (require.main === module) {
  const type = process.argv[2] || 'unknown';
  logEvent(type);
}

module.exports = logEvent;
