// Meu arquivo inspect-music.js e cabeçalho
// author: Juan 03/04/2026

const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');

// Definição de diretório das músicas
const musicDir = '/mnt/armazenamento/mastercode/Santuario_Sonoro';

// Ler os arquivos e filtrar apenas .mp3
const files = fs.readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3'));
console.log(`Encontrado ${files.length} arquivos MP3\n`);

for ( const file of files ){
  const fullPath = path.join(musicDir, file);
  const tags = NodeID3.read(fullPath);

  console.log(`📁 ${file}`);
  console.log(` Título: ${tags.title || '❌ não definido'}`);
  console.log(` Artrista: ${tags.artist || '❌ não definido'}`);
  console.log(` Ano: ${tags.year || '❌ não definido'}`);
  console.log(` Gênero: ${tags.genre || '❌ não definido'}`);
  console.log(` Comentário: ${tags.comment?.text || '❌ '}`);
  console.log('----');
}

