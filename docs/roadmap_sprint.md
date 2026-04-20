------------------------------
## 🗺️ Ecossistema Vimpank - Diário de Bordo## 🏁 Sprint: Integridade e Escovação de Bits (Concluída 18/04/2026)
Nesta sessão, deixamos de apenas "ter os dados" e passamos a governá-los. Aplicamos a filosofia do marceneiro: gavetas organizadas e travas de segurança.
## 🚀 Evolução Técnica:

* Integridade Referencial: Implementação de UNIQUE Constraints no SQLite para ISBN e para o conjunto (Título, Autor, Edição).
* Fim do Paradoxo do Aniversariante: O sistema agora distingue obras diferentes do mesmo autor e impede duplicatas inúteis.
* Busca Assertiva: Criação da "Gaveta do ISBN" no repositório para acesso cirúrgico e de alta performance.
* Service Inteligente: CursoService atualizado para atuar como porteiro, validando duplicidades antes de tocar no banco de dados.
* Ferramental de Estudo: Configuração do npm run lab para isolar estudos lógicos e nodemon para desenvolvimento contínuo.

## ✅ Check-list de Segurança (DDS):

* Travas Físicas: Unicidade garantida por design no banco de dados (Pilar 2).
* Fail-Fast: Mensagens de erro claras para conflitos de duplicidade.
* Sintaxe Blindada: Correção de erros críticos de estrutura SQL (parênteses e vírgulas).

------------------------------
## 🔜 Próxima Escala: A Barragem de Validação (Submódulo 2.2 e 2.3)## 🛠️ Tarefas para o Próximo Planejamento:

   1. Implementação do Zod (A Barragem): Migrar as validações manuais do Curso.js para Schemas do Zod, performando a manutenção e escalabilidade.
   2. Busca Dinâmica Completa: Refinar o listar para aceitar filtros de Autor e ISBN via Query String (?autor=...&isbn=...).
   3. Middleware de Aspecto: Criar a primeira camada transversal para validar entradas sem sujar as rotas.
   4. Normalização na Garimpagem: Iniciar o script automático na pasta scripts/ para renomear os PDFs usando as variáveis $1 (Autor) e $2 (Edição).

------------------------------
## 🛡️ DDS (Diálogo Diário de Segurança) para Amanhã:

* Risco: Inundação de dados sujos via POST/PUT.
* Ação: Instalação e configuração do Zod como nossa barragem principal.
* Meta: Reduzir o esforço manual de validação e ganhar energia elétrica (automação) para focar na lógica de negócio.

------------------------------
Tudo pronto, Juan! Documento atualizado e salvo na "gaveta" de docs/.
Podemos fechar a oficina por hoje e nos encontrar amanhã para o DDS e Execução?


------------------------------
## 🗺️ Ecossistema Vimpank - Diário de Bordo## Sprint Atual: Materialização e Blindagem (Concluída 17/04/2026)
Nesta sessão, saímos da "miragem" de dados e estabelecemos a base real do sistema.
🚀 Evolução Técnica:

* Data Seeding (A Semente): Implementada criação automática do curso ID 1 no servidor para garantir ambiente de teste estável.
* Domain (O Coração): Classe Curso atualizada com suporte a Autor, Edição, ISBN e Páginas.
* Pilar 1 (Segurança): Sanitização rigorosa via Regex Whitelist (suporte a acentuação PT-BR) aplicada no nível de Domínio.
* Persistence (Infra): CursoRepositorySqlite atualizado para gerenciar todas as novas colunas bibliográficas.
* API Contract: Testes de contrato (Jest/Supertest) passando com validação de tipos (expect.any) e suporte a campos nulos.
* Docs (Swagger): openapi.yaml 100% sincronizado com a nova estrutura de dados.

✅ Check-list de Segurança:

* Prevenção de SQL Injection (Prepared Statements).
* Sanitização de Área de Superfície (Regex no Domain).
* Fail-fast em Testes (Sem silenciamento de erros 404).

------------------------------
## 🔜 Próxima Escala (Submódulo 2.2):

* Filtros de Busca: Implementar a lógica de busca por ISBN e Autor na query string.
* Normalização na Garimpagem: Criar um script para automatizar a renomeação dos PDFs sujos usando as variáveis $1 e $2 que você identificou.



