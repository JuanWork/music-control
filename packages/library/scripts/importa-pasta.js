// Arquivo catalogo.js – genérico com argumentos --pasta e --categoria

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const readline = require('readline');
const { DB_PATH } = require('./config');   // vem do arquivo config.js

// ===== FUNÇÃO PARA LER ARGUMENTOS =====
function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : null;
}

// ===== ARGUMENTOS =====
const PASTA = getArg('pasta');
const CATEGORIA = getArg('categoria');
const dryRun = process.argv.includes('--dry-run');
const yes = process.argv.includes('--yes');

if (!PASTA || !CATEGORIA) {
  console.error('❌ Uso: node catalogo.js --pasta <caminho> --categoria <nome> [--dry-run] [--yes]');
  process.exit(1);
}

// NÃO redeclarar DB_PATH aqui – ele já vem do config

// Regex para extrair autor e edição
const regex = /^(.+?)(\d+edicao)\.pdf$/i;

function extrairDados(nomeArquivo) {
  try {
    const match = nomeArquivo.match(regex);
    if (match) {
      let autorRaw = match[1];
      let edicaoRaw = match[2];
      const edicao = edicaoRaw.replace(/(\d+).*/, '$1ª Edição');
      autorRaw = autorRaw.replace(/([a-z])([A-Z])/g, '$1 $2');
      autorRaw = autorRaw.replace(/[._-]/g, ' ').trim();
      const autor = autorRaw.replace(/\b\w/g, l => l.toUpperCase());
      return { autor, edicao };
    }
    const nomeSemExt = nomeArquivo.replace(/\.pdf$/i, '');
    return { autor: nomeSemExt, edicao: '' };
  } catch (err) {
    console.error(`❌ Erro ao extrair dados de ${nomeArquivo}: ${err.message}`);
    return { autor: 'ERRO', edicao: '' };
  }
}

async function main() {
  try {
    console.log(`📂 Processando pasta: ${PASTA}`);
    let arquivos;
    try {
      arquivos = fs.readdirSync(PASTA).filter(f => f.toLowerCase().endsWith('.pdf'));
    } catch (err) {
      console.error(`❌ Não foi possível ler o diretório ${PASTA}: ${err.message}`);
      process.exit(1);
    }
    console.log(`📄 Encontrados ${arquivos.length} arquivos PDF.`);

    const livros = [];
    for (const arquivo of arquivos) {
      const caminhoCompleto = path.join(PASTA, arquivo);
      const { autor, edicao } = extrairDados(arquivo);
      livros.push({
        autor_principal: autor,
        edicao: edicao,
        categoria: CATEGORIA,
        caminho_arquivo: caminhoCompleto,
        nome_arquivo: arquivo,
        paginas: null,
        isbn_impresso: null
      });
    }

    if (dryRun) {
      console.log('\n[DRY RUN] Simulação dos dados extraídos:\n');
      livros.forEach((l, i) => {
        console.log(`${i + 1}. Arquivo: ${l.nome_arquivo}`);
        console.log(`   Autor: ${l.autor_principal}`);
        console.log(`   Edição: ${l.edicao}`);
        console.log(`   Páginas: ${l.paginas ?? 'N/A'}`);
        console.log(`   ISBN Impresso: ${l.isbn_impresso ?? 'N/A'}`);
        console.log(`   Categoria: ${l.categoria}`);
        console.log(`   Caminho: ${l.caminho_arquivo}\n`);
      });
      console.log(`Total de livros que seriam inseridos: ${livros.length}`);
      console.log('Nenhum dado foi alterado no banco');
      return;
    }

    if (!yes) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      let resposta;
      try {
        resposta = await new Promise(resolve => rl.question(`❓ Deseja inserir ${livros.length} livro(s) no banco? (s/N): `, resolve));
        rl.close();
      } catch (err) {
        console.error(`❌ Erro na entrada do usuário: ${err.message}`);
        process.exit(1);
      }
      if (resposta.toLowerCase() !== 's') {
        console.log('❌ Operação cancelada.');
        return;
      }
    }

    console.log('💾 Conectando ao banco de dados...');
    let db;
    try {
      db = new Database(DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS biblioteca (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          autor_principal TEXT,
          edicao TEXT,
          categoria TEXT,
          caminho_arquivo TEXT UNIQUE,
          data_cadastro DATE DEFAULT CURRENT_DATE,
          paginas INTEGER,
          isbn_impresso TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_caminho ON biblioteca(caminho_arquivo);
      `);
    } catch (err) {
      console.error(`❌ Erro ao conectar ou criar tabela: ${err.message}`);
      process.exit(1);
    }

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO biblioteca (autor_principal, edicao, categoria, caminho_arquivo, paginas, isbn_impresso)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let inseridos = 0;
    for (const livro of livros) {
      try {
        const result = insertStmt.run(
          livro.autor_principal,
          livro.edicao,
          livro.categoria,
          livro.caminho_arquivo,
          livro.paginas,
          livro.isbn_impresso
        );
        if (result.changes > 0) inseridos++;
      } catch (err) {
        console.error(`❌ Erro ao inserir ${livro.nome_arquivo}: ${err.message}`);
      }
    }
    console.log(`✅ ${inseridos} livro(s) inseridos com sucesso.`);
    db.close();
  } catch (err) {
    console.error(`❌ Erro fatal no script: ${err.message}`);
    process.exit(1);
  }
}

main();
