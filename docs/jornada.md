# 📜 Jornada do VimPank – Da Ideia ao Spec Driven

Este documento narra a saga completa da construção do ecossistema **VimAcademe** dentro do monorepo **VimPank**.
Cada seção corresponde a um dia de estudo sugerido, com os arquivos relevantes e perguntas para guiar sua reflexão.

---

## 📅 Dia 1 – O Nascimento da Ideia e a Estrutura Base

**O que foi decidido:**
- Construir um ecossistema chamado **VimAcademe** dentro de um monorepo `VimPank`.
- Usar **Clean Architecture** para separar regras de negócio (Domínio) de detalhes técnicos (Infraestrutura).

**Arquivos para estudar:**
1. `apps/Vimpank-Academy/src/domain/curso.js` – A entidade `Curso` e suas regras de validação.
2. `apps/Vimpank-Academy/src/domain/curso-repository.js` – O contrato (interface) do repositório.

**Perguntas para guiar seu estudo:**
- Por que a classe `Curso` tem um método `validar` estático?
- O que significa `throw new Error('Método não implementado')` na classe `CursoRepository`? Qual a vantagem disso?

---

## 📅 Dia 2 – A Camada de Aplicação e a Injeção de Dependência

**O que foi decidido:**
- Criar um `CursoService` que orquestra as operações e **recebe** um repositório no construtor.

**Arquivo para estudar:**
- `apps/Vimpank-Academy/src/application/curso-service.js`

**Perguntas para guiar seu estudo:**
- Onde está a lógica de negócio sendo chamada? (Dica: `Curso.validar`).
- Por que o serviço **não** importa diretamente o repositório de SQLite?

---

## 📅 Dia 3 – Os Repositórios Concretos (Memória e SQLite)

**O que foi decidido:**
- Criar duas implementações da interface `CursoRepository`: uma em memória (para testes) e outra com SQLite (para desenvolvimento).

**Arquivos para estudar:**
- `infrastructure/repositories/curso-repository-memory.js`
- `infrastructure/repositories/curso-repository-sqlite.js`

**Perguntas para guiar seu estudo:**
- Como a busca textual (`q`) é implementada no repositório em memória? E no SQLite?
- O que são **prepared statements** e por que eles aparecem no repositório SQLite?

---

## 📅 Dia 4 – O Adaptador HTTP (Express Router)

**O que foi decidido:**
- Criar um router que recebe o `CursoService` e traduz requisições HTTP em chamadas ao serviço.

**Arquivo para estudar:**
- `infrastructure/web/routes/cursos-router.js`

**Perguntas para guiar seu estudo:**
- Qual a responsabilidade **única** desse arquivo?
- Como os erros do serviço (`throw new Error`) são convertidos em status HTTP (400, 404)?

---

## 📅 Dia 5 – O Ponto de Entrada (Montagem das Peças)

**O que foi decidido:**
- Criar o `server-express.js` que **injeta** as dependências manualmente (repositório → serviço → router).

**Arquivo para estudar:**
- `apps/Vimpank-Academy/src/server-express.js`

**Perguntas para guiar seu estudo:**
- O que acontece se você quiser trocar o banco de dados de SQLite para PostgreSQL? Quantas linhas precisariam mudar?
- Qual o papel da função `require.main === module`?

---

## 📅 Dia 6 – Os Testes de Integração (Rede de Segurança)

**O que foi decidido:**
- Escrever testes com `supertest` que usam o repositório em memória para validar o comportamento da API.

**Arquivo para estudar:**
- `apps/Vimpank-Academy/tests/api-cursos.test.js`

**Perguntas para guiar seu estudo:**
- Por que os testes não usam o banco de dados real?
- O que o teste `POST /api/cursos com título inválido (número) retorna 400` está validando?

---

## 📅 Dia 7 – A Virada Spec Driven (Contratos com Zod)

**O que foi decidido:**
- Substituir a validação manual por schemas **Zod**, que servem como **fonte única da verdade** sobre a forma dos dados.

**Arquivos para estudar:**
- `packages/core/src/contracts/schemas/curso.schema.js`
- `infrastructure/web/routes/cursos-router.js` (observe o middleware `validateRequest`)

**Perguntas para guiar seu estudo:**
- Qual a diferença entre validar com `if` e validar com `z.object({...})`?
- O que acontece se você enviar um título com 2 caracteres? Quem rejeita a requisição?

---

## 📅 Dia 8 – A Documentação Viva (OpenAPI e Swagger)

**O que foi decidido:**
- Gerar automaticamente um arquivo `openapi.yaml` a partir dos schemas Zod.
- Servir o Swagger UI em `/docs`.

**Arquivos para estudar:**
- `scripts/generate-openapi.js`
- `packages/core/src/contracts/api/openapi.yaml` (abra e veja a mágica)
- `server-express.js` (trecho do Swagger UI)

**Perguntas para guiar seu estudo:**
- O que o `extendZodWithOpenApi(z)` faz?
- Por que o arquivo YAML nunca deve ser editado manualmente?

---

## 📅 Dia 9 – O Teste de Contrato (O Guardião do Acordo)

**O que foi decidido:**
- Criar um teste que valida se a resposta real da API **obedece** ao schema `CursoSchema`.

**Arquivo para estudar:**
- `apps/Vimpank-Academy/tests/contract/cursos.contract.test.js`

**Perguntas para guiar seu estudo:**
- Qual a diferença entre um teste de integração comum e um teste de contrato?
- O que o método `safeParse` retorna?

---

## 📅 Dia 10 – A Estrutura de Pastas (O Mapa do Tesouro)

**O que foi decidido:**
- Organizar o monorepo em `apps/` (aplicações) e `packages/` (bibliotecas compartilhadas).

**Exercício prático:**
- Abra o terminal e execute `tree -L 3` na raiz do projeto. Tente explicar para si mesmo a função de cada pasta.

---

## 🧠 Como Estudar Com Este Roteiro

1. **Leia o arquivo indicado no Vim.** Não tenha pressa.
2. **Anote as dúvidas** em um caderno ou arquivo `ANOTACOES.md`.
3. **Tente responder às perguntas** com suas próprias palavras.
4. Se travar, **volte à nossa conversa** (este chat) ou me pergunte diretamente.

---

*"Roma não foi construída em um dia, mas cada tijolo foi colocado com um propósito."* 🏛️
