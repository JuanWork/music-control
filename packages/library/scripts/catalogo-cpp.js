// Arquivo catalogo-cpp.js e cabeçalho e tratamento de erro try-catch

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const readline = require('readline'); // corrigido

// configuração

const PASTA = '/mnt/armazenamento/biblioteca-vimmemore/java';
const CATEGORIA = 'Java';
const DB_PATH =  '/mnt/armazenamento/mastercode/database/library.db';

// Argumentos da linha de comando

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const yes = args.includes('--yes');

// Regex para extrair autor e edição
/**
 * /^(.+?) => captura o autor
 * (\d+edicao) => captura dígitos seguidos de "edicao"
 * \.pdf$/i final do nome do arquivo
 */

const regex = /^(.+?)(\d+edicao)\.pdf$/i;

function extrairDados(nomeArquivo){
  try{
    const match = nomeArquivo.match(regex);
    if (match){
      let autorRaw = match[1];
      let edicaoRaw = match[2]; // ex: "10edicao"

      // Pega apenas os números (\d+) e adicina "ª Edição"
      /**
       * (\d+): captura a sequência de números (grupo 1)
       * .*: Ignora o restante do texto ("edicao").
       * $1ª Edição: Substitui tudo pelo número capturado seguido de "ªEdição"
       */

      const edicao = edicaoRaw.replace(/(\d+).*/, '$1ª Edição');

      //Insere espaço entre letras (Ex: LuisDamas -> Luis Damas)
      /**
       *([a-z]): captura uma letra minúscula(grupo 1).
       *([A-Z]): captura uma letra maiúscula(grupo 2).
       * '$1 $2': substitui pelo grupo 1 + espaço + grupo 2
       */
      autorRaw = autorRaw.replace(/([a-z])([A-Z])/g, '$1 $2');

      // limpa carateres especiais(._-)/g
      autorRaw = autorRaw.replace(/[._-]/g, ' ').trim(); // correção

      const autor = autorRaw.replace(/\b\w/g, l => l.toUpperCase());


      return { autor, edicao };
    }
    const nomeSemExt = nomeArquivo.replace(/\.pdf$/i, ''); // correção
    return { autor: nomeSemExt, edicao: '' };
  } catch (err){
    console.error(`❌ Erro ao extrair dados de ${nomeArquivo}: ${err.message}`);
		return { autor: 'ERRO', edicao: '' };
  }
}

// Função principal (osync para usar readline)

async function main(){
	try{
		console.log(`📂 Processando pasta: ${PASTA}`);
		// Leitura do diretório
		let arquivos;
		try{
			arquivos = fs.readdirSync(PASTA).filter( f => f.toLowerCase().endsWith('.pdf'));
		}catch (err){
		console.error(`❌ Não foi possível ler o diretório ${PASTA}: ${err.message}`);
		process.exit(1)
	}
	console.log(`📄 Encontrados ${arquivos.length} arquivos PDF. `);

// Extração dos dados

const livros = [];
for (const arquivo of  arquivos){
		const caminhoCompleto = path.join(PASTA, arquivo);
		const { autor, edicao } = extrairDados(arquivo);
		livros.push({
    autor_principal: autor, // corrigido
		edicao: edicao, // corrigido
		categoria: 	CATEGORIA,
		caminho_arquivo: caminhoCompleto,
		nome_arquivo : arquivo,
		});
}

// Simulação (dryRun)

if (dryRun) {
	console.log('\n [DRY RUN] Simulação dos dados extraídos:\n');
	livros.forEach((l, i) => {
		console.log(`${i+1}. Arquivo: ${l.nome_arquivo}`);
		console.log(` Autor: ${l.autor_principal}`);
		console.log(` Edição: ${l.edicao}`);
		console.log(` Categoria: ${l.categoria}`);
		console.log(` Caminho: ${l.caminho_arquivo}\n`);
	});
	console.log(` Total de livros que seriam inseridos: ${livros.length}`);
	console.log('Nenum dado foi alterado no banco');
	return;
}

//  Confirmação interativa (se não tiver --yes)
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

        // --- Conexão e inserção no banco ---
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
                    data_cadastro DATE DEFAULT CURRENT_DATE
                );
                CREATE INDEX IF NOT EXISTS idx_caminho ON biblioteca(caminho_arquivo);
            `);
        } catch (err) {
            console.error(`❌ Erro ao conectar ou criar tabela: ${err.message}`);
            process.exit(1);
        }

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO biblioteca (autor_principal, edicao, categoria, caminho_arquivo)
            VALUES (?, ?, ?, ?)
        `);

        let inseridos = 0;
        for (const livro of livros) {
            try {
                const result = insertStmt.run(livro.autor_principal, livro.edicao, livro.categoria, livro.caminho_arquivo);
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

// Executar a função principal
main();


