# 🎵 Vim Pank – Ecossistema Fullstack com Arquitetura Limpa e Spec Driven 🧬

> *"Ei Linux, sou seu parente. E agora, sou seu Arquiteto."*

[![Tests](https://img.shields.io/badge/tests-20%2B%20passing-brightgreen)](https://jestjs.io)
[![Security](https://img.shields.io/badge/security-pragmatic-blue)](#-leis-de-segurança)
[![Architecture](https://img.shields.io/badge/architecture-clean%20%2B%20spec%20driven-9cf)](#-arquitetura)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

---

## 🏛️ A Conquista de Hoje – Spec Driven Development em Produção

Hoje o **VimPank** atingiu um novo patamar de maturidade. Implementamos um ciclo completo de **especificação executável**:

- ✅ **Contratos Zod** como fonte única da verdade.
- ✅ **Validação automática** no backend (middleware `validateRequest`).
- ✅ **OpenAPI gerada automaticamente** a partir dos schemas (`scripts/generate-openapi.js`).
- ✅ **Swagger UI** servido em `/docs` com todos os endpoints e modelos interativos.
- ✅ **Testes de contrato** que garantem que a API jamais traia a especificação.

> **Acesse a documentação viva:** suba o servidor com `node apps/Vimpank-Academy/src/server-express.js` e abra `http://localhost:3000/docs`.

---

## 🏗️ O Ecossistema Vimpank (Monorepo)

O **Vim Pank** é um ecossistema fullstack completo, onde o código é tratado como engenharia e a segurança é o alicerce.

### 🤝 Os Integrantes do Time

| Módulo | Papel | Descrição |
|--------|-------|-----------|
| **`apps/Vimpank-Academy`** | O Professor | Servidor Express robusto que gerencia cursos. Aqui aplicamos Clean Architecture e validação por contratos. |
| **`apps/music-control`** | O Maestro | Controle original de música, agora integrado ao ecossistema. |
| **`packages/core`** | O Guardião dos Contratos | Schemas Zod, tipos compartilhados e geração automática de OpenAPI. |
| **`packages/library`** | VimMemore | Camada de persistência com SQLite3 e prepared statements. |

---

## 🧱 Arquitetura – Camadas e Responsabilidades

apps/Vimpank-Academy/src/
├── domain/ # Regras de negócio puras (Curso, CursoRepository)
├── application/ # Casos de uso (CursoService)
├── infrastructure/ # Detalhes técnicos
│ ├── repositories/ # Implementações concretas (Memory, SQLite)
│ └── web/routes/ # Adaptadores HTTP (Express Router)
└── server-express.js # Composição das dependências (injeção manual)


**Princípios aplicados:**
- **Domínio não conhece infraestrutura.**
- **Repositórios implementam uma interface definida no domínio.**
- **Testes usam repositórios em memória** – rápidos, isolados e confiáveis.

---

## 🛡️ Leis de Segurança (The Pragmatic Way)

Nenhuma janela quebrada. Todo código segue rigorosamente:

1. **Sanitização Universal:** Regex remove caracteres perigosos antes de qualquer processamento.
2. **Minimização de Superfície:** Validamos tipos, tamanhos e estados (agora com Zod).
3. **Resiliência:** `try-catch` obrigatório – o servidor nunca morre.
4. **Diagnóstico Contínuo:** Testes de integração, unidade e contrato com Jest.

---

## 📜 Especificação Viva – O Ciclo Spec Driven

A documentação **não é um favor**, é um artefato gerado automaticamente:

| Etapa | Ferramenta | Resultado |
|-------|------------|-----------|
| **Definir** | Zod schemas em `packages/core/src/contracts/schemas/` | Fonte única da verdade |
| **Validar** | Middleware `validateRequest` no Express | Requisições inválidas são rejeitadas com 400 |
| **Documentar** | Script `generate-openapi.js` | Gera `openapi.yaml` a partir dos schemas |
| **Visualizar** | Swagger UI em `/docs` | Interface interativa com todos os endpoints |
| **Garantir** | Testes de contrato em `tests/contract/` | A API real obedece à especificação |

> **Fluxo completo:** Altere um schema Zod → execute `npm run generate:openapi` → documentação atualizada instantaneamente.

---

## 🚀 Como Iniciar o Vimpank

### 🔧 Instalação

```bash
git clone https://github.com/JuanWork/music-control
cd music-control
npm install
```

### 🧪 Rodar os Testes (Diagnóstico Completo)

O Jest executará:
- Testes de integração da API (CRUD, paginação, busca).
- Testes de contrato (validação contra schemas Zod).
- Testes do servidor (rotas estáticas, 404).

### 🌐 Subir o Servidor com Documentação

```bash
node apps/Vimpank-Academy/src/server-express.js
```

Acesse:
- **API:** `http://localhost:3000/api/cursos`
- **Documentação interativa:** `http://localhost:3000/docs`

---

## 📖 Jornada de Aprendizado

Cada decisão de arquitetura, cada erro superado e cada linha de código foi registrada em [`docs/JORNADA.md`](docs/JORNADA.md).
É um diário de bordo para quem quiser entender o *como* e o *porquê* por trás deste ecossistema.

---

## 🤝 Contribuição e Licença

Este projeto é open source sob a licença **MIT**.
Sinta-se livre para usar, estudar, modificar e compartilhar. Créditos ao arquiteto **JuanWork** são sempre bem-vindos.

---

*"Roma não foi construída em um dia, mas cada tijolo foi colocado com um propósito."* 🏛️
