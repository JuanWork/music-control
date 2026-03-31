# 🎮 Guia de Comandos do Vim Pank

## Índice
- [Instalação Rápida](#instalação-rápida)
- [Comandos do Vim](#comandos-do-vim)
- [Atalhos de Teclado](#atalhos-de-teclado)
- [Comandos do Sistema](#comandos-do-sistema)
- [Logs Humanizados](#logs-humanizados)
- [Personalização](#personalização)
- [Solução de Problemas](#solução-de-problemas)

---

## 🚀 Instalação Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/JuanWork/music-control.git
cd music-control

2. Configure o ambiente
bash

npm run setup

3. Teste se está funcionando
bash

node tests/test-trinha.js

4. Adicione ao seu .vimrc

Copie o bloco abaixo para o final do seu ~/.vimrc:
vim

" ============================================================================
" VIM PANK - Music Control
" ============================================================================

let g:music_path = "/home/seu-usuario/dev/projeto-vimpank/music-control"

function! IsPlayerRunning()
  return system('pgrep rhythmbox') != ''
endfunction

function! MusicLog(type)
  execute "!node " . g:music_path . "/src/aspects/logs.js " . a:type
  redraw!
  if a:type == 'sucesso'
    echo "🏆 Conquista!"
  else
    echo "🎸 Nó registrado!"
  endif
endfunction

" Comandos principais

command! MusicPlay  call system('rhythmbox-client --play') | redraw | echo "▶️ Tocando"
command! MusicPause call system('rhythmbox-client --pause') | redraw | echo "⏸️ Pausado"
command! MusicNext  if IsPlayerRunning() | call system('rhythmbox-client --next') | redraw | echo "⏭️ Próxima" | else | echo "🎵 Player desligado" | endif
command! MusicPrev  if IsPlayerRunning() | call system('rhythmbox-client --previous') | redraw | echo "⏮️ Anterior" | else | echo "🎵 Player desligado" | endif
command! MusicVolUp   if IsPlayerRunning() | call system('rhythmbox-client --volume-up') | redraw | echo "🔊 Volume +" | else | echo "🎵 Player desligado" | endif
command! MusicVolDown if IsPlayerRunning() | call system('rhythmbox-client --volume-down') | redraw | echo "🔉 Volume -" | else | echo "🎵 Player desligado" | endif
command! MusicStatus if IsPlayerRunning() | echo "📻 " . substitute(system('rhythmbox-client --print-playing'), '\n', '', 'g') | else | echo "🔇 Player Inativo" | endif
command! MusicWin call MusicLog('sucesso')
command! MusicNo call MusicLog('nó')

" Atalhos rápidos

nnoremap <leader>mn :MusicNext<CR>
nnoremap <leader>mp :MusicPrev<CR>
nnoremap <leader>ms :MusicStatus<CR>
nnoremap <leader>mw :MusicWin<CR>
nnoremap <leader>me :MusicNo<CR>
nnoremap <leader>m+ :MusicVolUp<CR>
nnoremap <leader>m- :MusicVolDown<CR>

⚠️ Importante: Ajuste o caminho g:music_path para o local correto no seu sistema.
5. Recarregue o .vimrc
vim

:source ~/.vimrc

🎵 Comandos do Vim
Controle Básico
Comando	Função	Feedback
:MusicPlay	▶️ Tocar música	"▶️ Tocando"
:MusicPause	⏸️ Pausar música	"⏸️ Pausado"
:MusicNext	⏭️ Próxima música	"⏭️ Próxima"
:MusicPrev	⏮️ Música anterior	"⏮️ Anterior"
:MusicStatus	📻 Mostrar música atual	"📻 Nome da música"
Volume
Comando	Função	Feedback
:MusicVolUp	🔊 Aumentar volume	"🔊 Volume +"
:MusicVolDown	🔉 Diminuir volume	"🔉 Volume -"
Logs Humanizados
Comando	Função	Feedback
:MusicWin	🏆 Registrar conquista	"🏆 Conquista!"
:MusicNo	🎸 Registrar nó	"🎸 Nó registrado!"
Controle do Player
Comando	Função	Feedback
:MusicStop	⏹️ Fechar Rhythmbox	"⏹️ Player encerrado"

⌨️ Atalhos de Teclado

Mapeamentos com Leader (espaço)
Atalho	Comando	Função
␣mn	:MusicNext	⏭️ Próxima música
␣mp	:MusicPrev	⏮️ Música anterior
␣ms	:MusicStatus	📻 Ver música atual
␣mw	:MusicWin	🏆 Registrar conquista
␣me	:MusicNo	🎸 Registrar nó
␣m+	:MusicVolUp	🔊 Aumentar volume
␣m-	:MusicVolDown	🔉 Diminuir volume

Como usar: Pressione espaço + as teclas acima.

Exemplo:

    espaço + m + n → próxima música

    espaço + m + s → ver música atual

💻 Comandos do Sistema
Via Terminal

Você também pode controlar a música diretamente do terminal:
bash

# Navegue até o projeto
cd ~/dev/projeto-vimpank/music-control

# Comandos básicos
node -e "require('./src/music-control').playPause()"
node -e "require('./src/music-control').next()"
node -e "require('./src/music-control').previous()"
node -e "require('./src/music-control').volumeUp()"
node -e "require('./src/music-control').volumeDown()"
node -e "require('./src/music-control').current().then(console.log)"

Comandos Rhythmbox Diretos

Se preferir usar o Rhythmbox diretamente:
bash

rhythmbox-client --play-pause
rhythmbox-client --next
rhythmbox-client --previous
rhythmbox-client --volume-up
rhythmbox-client --volume-down
rhythmbox-client --print-playing

📝 Logs Humanizados
Onde ficam os logs
bash

cat src/data/logs.json

Exemplo de saída
json

{
  "session_logs": [
    {
      "timestamp": "2026-03-31T14:23:00.123Z",
      "event": "Conquista",
      "status": "success",
      "mood": "calma",
      "message": "Humanização completa. Código fluido."
    },
    {
      "timestamp": "2026-03-31T15:47:00.456Z",
      "event": "Nó no desenvolvimento",
      "status": "error",
      "mood": "adrenalina",
      "message": "IA e Dev em sintonia: Superando o bloqueio!"
    }
  ]
}

Analisando seus padrões
bash

# Ver quantas conquistas você teve
cat src/data/logs.json | grep "Conquista" | wc -l

# Ver quantos nós você desatou
cat src/data/logs.json | grep "Nó" | wc -l

# Ver horários de maior produtividade
cat src/data/logs.json | grep "timestamp"

🎨 Personalização
Mudar o player padrão

No arquivo src/aspects/logs.js, ajuste a função getMusicCommand:
javascript

const commands = {
  linux: {
    next: 'seu-player --next',  // troque aqui
    play: 'seu-player --play'
  }
};

Adicionar novos atalhos no Vim

No seu .vimrc, adicione:
vim

" Seu atalho personalizado
nnoremap <F8> :MusicPlay<CR>
nnoremap <F9> :MusicNext<CR>

Mudar o feedback visual
vim

command! MusicNext if IsPlayerRunning() | call system('rhythmbox-client --next') | redraw | echo "🎵 Next!" | else | echo "⛔ No player" | endif

🔧 Solução de Problemas
Problema: "rhythmbox-client: command not found"

Solução: Instale o Rhythmbox
bash

# Ubuntu/Debian
sudo apt install rhythmbox

# Fedora
sudo dnf install rhythmbox

# Arch
sudo pacman -S rhythmbox

Problema: "Player desligado"

Solução: Inicie o Rhythmbox
bash

rhythmbox &

Problema: Sem áudio

Solução: Verifique:
bash

# 1. Se o Rhythmbox está rodando
pgrep rhythmbox

# 2. Se há música tocando
rhythmbox-client --print-playing

# 3. Se o volume do sistema não está mudo
amixer get Master

Problema: Comandos do Vim não funcionam

Solução: Verifique o caminho no .vimrc
vim

:echo g:music_path
" Deve mostrar: /home/seu-usuario/dev/projeto-vimpank/music-control

Problema: Proxy não está logando

Solução: Verifique se o logs.js está exportando corretamente
javascript

// Deve terminar com:
module.exports = aspectHumor;
// Não deve ter aspectHumor('sucesso') solto no arquivo!

🎯 Comandos Rápidos (Cheat Sheet)

No Vim


:MusicNext     ⏭️
:MusicPrev     ⏮️
:MusicPlay     ▶️
:MusicPause    ⏸️
:MusicStatus   📻
:MusicVolUp    🔊
:MusicVolDown  🔉
:MusicWin      🏆
:MusicNo       🎸

Atalhos (leader = espaço)


␣mn  → próximo
␣mp  → anterior
␣ms  → status
␣mw  → conquista
␣me  → nó
␣m+  → volume +
␣m-  → volume -

Terminal
bash

node -e "require('./src/music-control').next()"

🌟 Dicas de Produtividade

    Use os atalhos — depois que memorizar, o controle vira instinto

    Registre conquistas — cada :MusicWin é um reforço positivo

    Documente os nós — :MusicNo ajuda a identificar padrões de bloqueio

    Analise seus logs — descubra seus horários de pico de flow

    Compartilhe sua jornada — mostre seu logs.json para outros (se quiser)

📚 Leia Também

    Filosofia Vim Pank — a essência conceitual

    Arquitetura — como tudo funciona

    Manifesto — os 7 princípios

    README — visão geral do projeto

"Ei Linux, sou seu parente." 🧬🎵


---

## ✅ **Passo 6 concluído!**

Agora temos a documentação completa:

| Arquivo | Conteúdo | Status |
|---------|----------|--------|
| `README.md` | Visão geral, badges, instalação rápida | ✅ |
| `docs/filosofia.md` | Conceitos profundos, essência do Vim Pank | ✅ |
| `docs/arquitetura.md` | Detalhamento técnico, camadas, código | ✅ |
| `docs/manifesto.md` | Os 7 princípios, declaração filosófica | ✅ |
| `docs/comandos.md` | Guia prático, instalação, atalhos | ✅ |

---

## 📋 **Próximo e último passo:**

**Passo 7:** Commit e push para o GitHub

```bash
cd ~/dev/projeto-vimpank/music-control

# Verificar o que foi criado
ls -la docs/

# Adicionar arquivos
git add README.md docs/

# Commit
git commit -m "📚 Documentação completa do Vim Pank

- README.md com visão geral e badges
- docs/filosofia.md: a essência conceitual
- docs/arquitetura.md: detalhamento técnico
- docs/manifesto.md: os 7 princípios
- docs/comandos.md: guia prático de uso

'🚀 Ei Linux, sou seu parente.' 🧬"

# Push para o GitHub
git push origin main

