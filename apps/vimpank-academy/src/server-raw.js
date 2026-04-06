// server-raw.js cabeçalho e try-catch
const os = require('os');

// 1. O grito de conexão (Handshake)
console.log(`[Vimpank Academy] "👂 Eu te escuto, ${os.hostname()}!"`);

// 2. Identificando o modo de Ensaio
const isDryRun = process.argv.includes('--dry-run');

// 3. O Especialista em Segurança (Regex)
// Filtro: Apenas letras, números e espaços. O resto é "ruído".
const sanitizar = (msg) => msg.replace(/[^a-zA-Z0-9 áéíóúâêîôûãõç]/g, "");

// 4. O  Fluxo de Vida (try-catch)
async function processarConquista(texto) {
		try{
			console.log(`\n[Input] 📩 Recebendo: "${texto}"`);

			const textoLimpo = sanitizar(texto);

			if (isDryRun){
					console.log(`[Dry-Run] 🛡️ Teste de segurança: `);
					console.log(` 👉 De: "${texto}"`);
					console.log(` 👉 Para: "${textoLimpo}"`);
					console.log(`[Dry-Run] ✅  Sistema estável. Nada foi gravado`);
					return;
			}

			// Futura conexão com o banco (VimMemore) virá aqui
			console.log(`[Ação] 🚀  Preparando para salvar no SQlite3: ${textoLimpo}` );
		}catch (err) {
			console.error(`[Nó] ⚠️  Erro no fluxo de escuta: ${err.message}`);
		}
}

// 🏁 Teste de Fogo
processarConquista("Minha rota no Node! <script>alert(1)</script> #VimPank");

