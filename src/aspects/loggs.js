/**
 * 🕵️ Agente POA v2.0 - O Vigia com Sensor de Presença
 */

function createLogger(target) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod === 'function') {
        return async (...args) => {
          console.log(`[LOG] 📡 Tentando ação: ${prop}...`);

          try {
            const result = await originalMethod.apply(target, args);
            console.log(`[LOG] ✅ OK: ${prop} executado.`);
            return result;
          } catch (error) {
            // O NOSSO ALARME PERSONALIZADO:
            if (error.message.includes('not running') || error.message.includes('connection refused')) {
              console.log(`[LOG] ⚠️  ALARME: O Rhythmbox parece estar FECHADO!`);
            } else {
              console.log(`[LOG] ❌ ERRO INESPERADO: ${error.message}`);
            }
            // Não deixamos o sistema "morrer", apenas avisamos
            return null;
          }
        };
      }
      return originalMethod;
    }
  });
}

module.exports = createLogger;

