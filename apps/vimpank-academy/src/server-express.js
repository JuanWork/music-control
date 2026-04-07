const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json()); // Configurções Globais(TOPO - É todo o cabeçalho)

/**
 * 1. FUNÇÃO DE SANITIZAÇÃO (Segurança)
 * Esta regex permite letras, números, acentos comuns e pontuação básica.
 * Ela REMOVE caracteres perigosos como < > / \ { } [ ] para evitar XSS.
 */
const sanitizar = (entrada) => {
  if (typeof entrada !== 'string') return '';
  // Substitui qualquer coisa que NÃO esteja na lista por vazio
  return entrada.replace(/[^a-zA-Z0-9 áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ.,!?()-]/g, '');
};

/**
 * 2. MIDDLEWARE DE LOG (Monitoramento)
 * Registra cada acesso no terminal com data e hora.
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} em ${req.url}`);
  next();
});

/**
 * 3. ROTA PRINCIPAL (/)
 * Agora usamos o parâmetro 'nome' da URL: http://localhost:3000/?nome=Juan
 */
app.get('/', async (req, res) => {
  try {
    // Pegamos o nome da query string e limpamos IMEDIATAMENTE
    const nomeBruto = req.query.nome || 'Visitante';
    const nomeLimpo = sanitizar(nomeBruto);

    const html = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Vimpank Academy</title>
        <style>body { font-family: sans-serif; padding: 20px; line-height: 1.6; }</style>
      </head>
      <body>
        <h1>🎵 Vimpank Academy</h1>
        <p>Bem-vindo, <strong>${nomeLimpo}</strong>!</p>
        <p>Status: Servidor Express com <strong>Sanitização Ativa</strong>.</p>
        <nav>
          <a href="/sobre">Sobre o Projeto</a>
        </nav>
      </body>
      </html>
    `;
    res.send(html);
  } catch (erro) {
    console.error('Erro na Home:', erro);
    res.status(500).send('<h1>Erro 500</h1><p>Algo deu errado internamente.</p>');
  }
});

// Dados Iniciais (Array em memória)
let cursos=[
  {id:1,titulo:'JavaScript',descricao:'Fundamentos e avançado'},
  {id:2,titulo:'HTML',descricao:'Estrutura semântica'},
  {id:3,titulo:'CSS',descricao:'Estilização e layout'},
  {id:4,titulo:'Node.js',descricao:'Backend com JavaScript'},
  {id:5,titulo:'TypeScript',descricao:'Tipagem estática'},
  {id:6,titulo:'SQLite3',descricao:'Banco de dados relacinal'}

];
let nextId=7;

// O seu "Segurança" (Reutilizável e Rígido)
const validarCurso = (dados) => {
  const { titulo, descricao } = dados;

  if (typeof titulo !== 'string') return { valido: false, mensagem: 'Título deve ser texto' };

  const tituloLimpo = titulo.trim();
  if (tituloLimpo.length < 3 || tituloLimpo.length > 100) {
    return { valido: false, mensagem: 'Título deve ter entre 3 e 100 caracteres' };
  }

  return {
    valido: true,
    dados: {
      titulo: sanitizar(tituloLimpo),
      descricao: sanitizar(descricao ? descricao.trim() : '')
    }
  };
};

// ===== API DE CURSOS =====
app.get('/api/cursos', (req, res) => {
  try {
    res.json(cursos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/cursos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const curso = cursos.find(c => c.id === id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(curso);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.post('/api/cursos', (req, res) => {
  try {
    const validacao = validarCurso(req.body);
    if (!validacao.valido) return res.status(400).json({ erro: validacao.mensagem });
    const { titulo, descricao } = validacao.dados;
    const novoCurso = { id: nextId++, titulo, descricao };
    cursos.push(novoCurso);
    res.status(201).json(novoCurso);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.put('/api/cursos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Curso não encontrado' });
    const validacao = validarCurso(req.body);
    if (!validacao.valido) return res.status(400).json({ erro: validacao.mensagem });
    const { titulo, descricao } = validacao.dados;
    cursos[index] = { ...cursos[index], titulo, descricao };
    res.json(cursos[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.delete('/api/cursos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Curso não encontrado' });
    cursos.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});


/**
 * 4. ROTA SOBRE (/sobre)
 */
app.get('/sobre', async (req, res) => {
  try {
    const html = `
      <h1>Sobre a Vimpank</h1>
      <p>Desenvolvido para aprendizado robusto e seguro.</p>
      <a href="/">Voltar para Home</a>
    `;
    res.send(html);
  } catch (erro) {
    res.status(500).send('Erro ao carregar a página Sobre.');
  }
});

/**
 * 5. TRATAMENTO DE 404 (Página não encontrada)
 * Captura qualquer rota que não foi definida acima.
 */
app.use((req, res) => {
  res.status(404).send('<h1>404</h1><p>Ops! Essa página não existe.</p><a href="/">Voltar</a>');
});

/**
 * 6. INICIALIZAÇÃO
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor Vimpank rodando em: http://localhost:${PORT}`);
    console.log(`💡 Teste a sanitização em: http://localhost:${PORT}/?nome=Juan<script>`);
  });
}

module.exports = app;

