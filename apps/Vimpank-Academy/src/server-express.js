const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const { CursoRepositorySqlite } = require('./infrastructure/repositories/CursoRepositorySqlite');
const { CursoService } = require('./application/services/CursoService');
const { cursosRouter } = require('./infrastructure/web/routes/cursos-router');

// Autenticação
const { UsuarioRepositorySqlite } = require('./infrastructure/repositories/UsuarioRepositorySqlite');
const { AuthService } = require('./application/auth/AuthService');
const { authRouter } = require('./infrastructure/web/routes/auth-router');
const { authMiddleware } = require('./infrastructure/auth/authMiddleware');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
}));

const PORT = 3000;

// Swagger UI
const swaggerPath = path.join(__dirname, '../../../packages/core/src/contracts/api/openapi.yaml');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = yaml.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/docs`);
} else {
  console.warn('⚠️ Arquivo openapi.yaml não encontrado. Execute "node scripts/generate-openapi.js".');
}

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Banco de dados
const DB_PATH = process.env.DB_PATH || '/mnt/armazenamento/mastercode/database/library.db';
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(DB_PATH);

// Tabelas
db.exec(`CREATE TABLE IF NOT EXISTS cursos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  autor TEXT,
  edicao TEXT,
  isbn_impresso TEXT,
  paginas INTEGER,
  UNIQUE(titulo, autor, edicao),
  UNIQUE(isbn_impresso)
);`);

db.exec(`CREATE TABLE IF NOT EXISTS usuarios(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

// Semente
const seed = db.prepare(`INSERT OR IGNORE INTO cursos(id, titulo, descricao, autor, edicao, isbn_impresso, paginas) VALUES (?, ?, ?, ?, ?, ?, ?)`);
seed.run(1, "Ecossistema Vimpank", "Nossa miragem de sistema", "Juan Carlos", "2ª Edição", null, 400);
console.log('✨ [Semente] A miragem se materializou: com Autor e Edição.');

// Injeção de dependências
const cursoRepository = new CursoRepositorySqlite(db);
const cursoService = new CursoService(cursoRepository);

const usuarioRepository = new UsuarioRepositorySqlite(db);
const authService = new AuthService(usuarioRepository);

// Rotas públicas de autenticação
app.use('/api/auth', authRouter(authService));

// Rotas protegidas de cursos
app.use('/api/cursos', authMiddleware(authService), cursosRouter(cursoService));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head><meta charset="UTF-8"><title>Vimpank Academy</title></head>
    <body>
      <h1>🎵 VimPank Academy</h1>
      <p>Desenvolvido com Clean Architecture</p>
      <nav><a href="/sobre">Sobre</a> | <a href="/docs">Documentação</a> | <a href="/api/cursos">Cursos</a></nav>
    </body>
    </html>
  `);
});

app.get('/sobre', (req, res) => {
  res.send('<h1>Sobre a API</h1><p>API com separação de responsabilidades (Domain, Application, Infrastructure)</p><a href="/">Voltar</a>');
});

// 404
app.use((req, res) => {
  res.status(404).send('<h1>404</h1><a href="/">Home</a>');
});

// Erro global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro interno do servidor');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
