const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const { CursoRepositorySqlite } = require('./infrastructure/repositories/curso-repository-sqlite');
const { CursoService } = require('./application/curso-service');
const { cursosRouter } = require('./infrastructure/web/routes/cursos-router');

const app = express();
const PORT = 3000;  // <-- Movido para cá

// Swagger UI
const swaggerPath = path.join(__dirname, '../../../packages/core/src/contracts/api/openapi.yaml');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = yaml.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/docs`);
} else {
  console.warn('⚠️ Arquivo openapi.yaml não encontrado. Execute "npm run generate:openapi".');
}

// Middleware para JSON e log
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Banco de dados (caminho absoluto)
const DB_PATH = '/mnt/armazenamento/mastercode/database/library.db';
const db = new Database(DB_PATH);

// Injeção de dependências
const cursoRepository = new CursoRepositorySqlite(db);
const cursoService = new CursoService(cursoRepository);

// Rotas da API
app.use('/api/cursos', cursosRouter(cursoService));

// Rota raiz (HTML)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head><meta charset="UTF-8"><title>Vimpank Academy</title></head>
    <body>
      <h1>🎵 Vimpank Academy</h1>
      <p>API funcionando com Clean Architecture</p>
      <nav><a href="/sobre">Sobre</a> | <a href="/docs">Documentação</a> | <a href="/api/cursos">Cursos</a></nav>
    </body>
    </html>
  `);
});

// Rota /sobre
app.get('/sobre', (req, res) => {
  res.send('<h1>Sobre</h1><p>API com separação de responsabilidades (Domain, Application, Infrastructure)</p><a href="/">Voltar</a>');
});

// 404
app.use((req, res) => {
  res.status(404).send('<h1>404</h1><a href="/">Home</a>');
});

// Middleware de erro global
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
