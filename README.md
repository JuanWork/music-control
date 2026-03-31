# 🎵 Vim Pank - Music Control

*"Ei Linux, sou seu parente."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Philosophy](https://img.shields.io/badge/Philosophy-Vim_Pank-blue)](./docs/filosofia.md)
[![Flow State](https://img.shields.io/badge/Flow-State_Ready-brightgreen)]()
[![Ethical](https://img.shields.io/badge/Ethical-Local_First-brightgreen)]()
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Mac%20%7C%20Windows-lightgrey)]()

---

## 📖 O que é o Vim Pank?

**Vim Pank** não é apenas um plugin. É uma **filosofia de desenvolvimento** que une:

- 🧬 **Herança ancestral** — `child_process` como ponte entre código e sistema
- 🔄 **AOP nativo** — Programação Orientada a Aspectos com Proxy do ES6
- 🎭 **Multi-paradigma** — OO + AOP + Funcional + Imperativo no mesmo pacote
- 🎵 **Flow state** — Música como catalisadora do estado de fluxo
- 🏠 **Ético e local-first** — Tudo roda na sua máquina. Nada sobe pra nuvem.
- ❤️ **Humanizado** — Registra "nós" e "conquistas", não só erros e logs

---

## 🎯 Filosofia Central

> *"Programar não é só digitar código. É um fluxo de emoções, ritmo e criatividade. O Vim Pank reconhece isso e te acompanha na jornada."*

O nome **Pank** vem da dualidade:
- **Vim Dev** — a ferramenta afiada, técnica, precisa
- **Vim Comum** — o ser humano que sente, cria e flui

No mesmo pacote. Em simbiose.

**[📖 Leia a filosofia completa](./docs/filosofia.md)**

---

## 🏛️ Arquitetura em poucas linhas

```javascript
// 1. Herança do sistema via child_process
const { exec } = require('child_process');

// 2. Orientação a Objetos pura
class MusicControl {
  static playPause() { return this._exec('rhythmbox-client --play-pause'); }
  static _exec(cmd) { return new Promise(...); }
}

// 3. AOP com Proxy (sem frameworks!)
const createLogger = (MusicControl, aspectHumor) => {
  return new Proxy(MusicControl, {
    get(target, prop) {
      const original = target[prop];
      if (typeof original === 'function') {
        return async function(...args) {
          const result = await original.apply(target, args);
          aspectHumor('sucesso');  // ← aspecto transversal
          return result;
        };
      }
      return original;
    }
  });
};

// 4. Abstração multi-plataforma
const getMusicCommand = (action) => {
  const platform = os.platform();
  const commands = {
    linux: 'rhythmbox-client',
    darwin: 'osascript -e "tell application Music"',
    win32: 'powershell -command'
  };
  return commands[platform];
};

📖 Leia sobre a arquitetura

🚀 Instalação

# Clone o repositório
git clone https://github.com/JuanWork/music-control.git
cd music-control

# Instale as dependências (nenhuma, só Node.js!)
npm run setup

# Teste se está funcionando
node tests/test-trinha.js

🎮 Comandos
No Vim (adicione ao .vimrc)

command! MusicPlay  call system('rhythmbox-client --play')
command! MusicNext  call system('rhythmbox-client --next')
command! MusicPrev  call system('rhythmbox-client --previous')
command! MusicVolUp call system('rhythmbox-client --volume-up')
command! MusicStatus echo system('rhythmbox-client --print-playing')
command! MusicWin  call system('node ~/dev/.../logs.js sucesso')
command! MusicNo   call system('node ~/dev/.../logs.js nó')

Atalhos

nnoremap <leader>mn :MusicNext<CR>
nnoremap <leader>mp :MusicPrev<CR>
nnoremap <leader>ms :MusicStatus<CR>
nnoremap <leader>mw :MusicWin<CR>
nnoremap <leader>me :MusicNo<CR>
nnoremap <leader>m+ :MusicVolUp<CR>

📖 Lista completa de comandos

🌊 Manifesto

    Código é humano — não apenas lógica, mas emoção e ritm

    Flow state primeiro — remova fricções, mantenha a imersão

    Local-first e ético — seus dados são seus. Sem telemetria.

    Simplicidade radical — use o que o sistema já tem

    Multi-paradigma consciente — OO, AOP, Funcional, Imperativo, juntos

    Herança ancestral — reconheça o sistema operacional como seu parente

    Comunidade de flow — compartilhe nós e conquistas, se quiser

📖 Leia o manifesto completo

🧬 Por que "Ei Linux, sou seu parente"?

O child_process do Node.js herda diretamente do kernel do sistema operacional. Cada comando executado é uma mensagem ancestral:

exec('rhythmbox-client --next')
// "Ei Linux, eu vim de você. Somos família."
O Vim Pank reconhece essa ancestralidade e a honra.

🎤 Sobre o Autor

Juan — Analista de Sistema, Instrutor, professor, caminhoneiro, e criador do Vim Pank.

Acredito que:

    Código pode ter alma

    Ferramentas devem respeitar quem as usa

    O flow state é sagrado

GitHub | LinkedIn

📄 Licença

MIT — faça o que quiser, mas lembre: "Ei Linux, sou seu parente" 🧬

🌟 Se este projeto te fez pensar diferente sobre programação, dê uma estrela. É o nosso "MusicWin".