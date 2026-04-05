#!/usr/bin/env node
const Database = require('better-sqlite3');
const readline = require('readline');
const minimist = require('minimist');

const DB_PATH = '/mnt/armazenamento/juancode/database/athena.db';

const args = minimist(process.argv.slice(2), {
  string: [
    'titulo', 'subtitulo', 'autor', 'outros-autores', 'revisores',
    'editora', 'edicao', 'isbn-impresso', 'isbn-epub', 'categoria',
    'url', 'arquivo', 'localizacao'
  ],
  number: ['ano'],
  boolean: ['dry-run', 'yes'],
  alias: {
    t: 'titulo',
    sub: 'subtitulo',
    a: 'autor',
    oa: 'outros-autores',
    rev: 'revisores',
    ed: 'editora',
    a: 'ano',
    edicao: 'edicao',
    i: 'isbn-impresso',
    ie: 'isbn-epub',
    c: 'categoria',
    u: 'url',
    f: 'arquivo',
    loc: 'localizacao',
    d: 'dry-run',
    y: 'yes'
  }
});

async function perguntar() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (txt) => new Promise(resolve => rl.question(txt, resolve));
  const dados = { ...args };
  if (!dados.titulo) dados.titulo = await question('📖 Título: ');
  if (!dados.autor) dados.autor = await question('✍️ Autor principal: ');
  if (!dados['outros-autores']) dados['outros-autores'] = await question('👥 Outros autores (opcional): ');
  if (!dados.revisores) dados.revisores = await question('🔍 Revisores (opcional): ');
  if (!dados.editora) dados.editora = await question('🏢 Editora: ');
  if (!dados.ano) {
    const anoStr = await question('📅 Ano (opcional): ');
    dados.ano = anoStr ? parseInt(anoStr) : null;
  }
  if (!dados.edicao) dados.edicao = await question('📚 Edição (ex: 1ª ed.): ');
  if (!dados['isbn-impresso']) dados['isbn-impresso'] = await question('📘 ISBN impresso: ');
  if (!dados['isbn-epub']) dados['isbn-epub'] = await question('📱 ISBN EPUB: ');
  if (!dados.categoria) dados.categoria = await question('🏷️ Categoria: ');
  if (!dados.url) dados.url = await question('🌐 URL do livro: ');
  if (!dados.arquivo) dados.arquivo = await question('💾 Caminho do arquivo (PDF/EPUB): ');
  if (!dados.localizacao) dados.localizacao = await question('📍 Localização na estante (opcional): ');
  rl.close();
  return dados;
}

function validar(dados) {
  if (!dados.titulo || dados.titulo.trim() === '') throw new Error('Título é obrigatório.');
  if (!dados.autor || dados.autor.trim() === '') throw new Error('Autor principal é obrigatório.');
  if (!dados.arquivo || dados.arquivo.trim() === '') throw new Error('Caminho do arquivo é obrigatório.');
  return {
    titulo: dados.titulo.trim(),
    subtitulo: dados['subtitulo']?.trim() || null,
    autor_principal: dados.autor.trim(),
    outros_autores: dados['outros-autores']?.trim() || null,
    revisores: dados.revisores?.trim() || null,
    editora: dados.editora?.trim() || null,
    ano: dados.ano || null,
    edicao: dados.edicao?.trim() || null,
    isbn_impresso: dados['isbn-impresso']?.trim() || null,
    isbn_epub: dados['isbn-epub']?.trim() || null,
    categoria: dados.categoria?.trim() || null,
    caminho_arquivo: dados.arquivo.trim(),
    url: dados.url?.trim() || null,
    localizacao: dados.localizacao?.trim() || null
  };
}

async function main() {
  try {
    let dados = args;
    if (!dados.titulo || !dados.autor || !dados.arquivo) {
      console.log('📝 Modo interativo – preencha os dados:\n');
      dados = await perguntar();
    }
    const livro = validar(dados);
    console.log('\n📦 Dados a serem inseridos:');
    console.table(livro);

    if (args['dry-run']) {
      console.log('🔍 [DRY RUN] Nenhum dado foi inserido no banco.');
      return;
    }

    if (!args.yes) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const resp = await new Promise(resolve => rl.question('❓ Confirmar inserção? (s/N): ', resolve));
      rl.close();
      if (resp.toLowerCase() !== 's') {
        console.log('❌ Operação cancelada.');
        return;
      }
    }

    const db = new Database(DB_PATH);
    const stmt = db.prepare(`
      INSERT INTO biblioteca 
      (titulo, subtitulo, autor_principal, outros_autores, revisores, editora, ano, edicao,
       isbn_impresso, isbn_epub, categoria, caminho_arquivo, url, localizacao, data_cadastro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
    `);
    const info = stmt.run(
      livro.titulo, livro.subtitulo, livro.autor_principal, livro.outros_autores,
      livro.revisores, livro.editora, livro.ano, livro.edicao,
      livro.isbn_impresso, livro.isbn_epub, livro.categoria,
      livro.caminho_arquivo, livro.url, livro.localizacao
    );
    db.close();
    console.log(`✅ Livro "${livro.titulo}" adicionado com sucesso! (ID: ${info.lastInsertRowid})`);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

main();
