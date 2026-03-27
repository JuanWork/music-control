# 🎵 Music Control – Controle de música nativo com Node.js

Controle o Rhythmbox (ou outro player compatível) via código JavaScript. Projetado para ser estendido com Programação Orientada a Aspectos (POA) – programação humanizada.

## 🚀 Como usar

```js
const Control = require('music-control');

// Play/Pause
await Control.playPause();

// Próxima música
await Control.next();

// Música atual
console.log(await Control.current());
npm test

### 4. **Crie o `.gitignore`**
```bash
cat > .gitignore << 'EOF'
node_modules/
*.log
.env
.DS_Store
