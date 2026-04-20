
Essa saga foi de tirar o fôlego! Saímos de um teste que "fingia" que funcionava para um sistema com identidade, segurança e alma.
Aqui está uma proposta de README.md que une a técnica da Clean Architecture com a filosofia da nossa jornada de hoje. Perfeito para registrar como a "miragem" se tornou rocha.
------------------------------
## 🎵 Ecossistema Vimpank: A Saga da Materialização

"Na escola tudo funciona, mas na vida real, a computação é feita de situações e escolhas."

Este projeto não é apenas um monorepo de estudos; é um ecossistema construído sob os pilares da Segurança Rigorosa e da Maturidade Técnica. Aqui, cada linha de código combate o "elefante na sala" da dívida técnica.
## 🏛️ A Arquitetura do Coração
Utilizamos Clean Architecture para garantir que as regras de negócio sejam imutáveis, independentemente da tecnologia de entrega.

* Domain (O Coração): Onde a lógica respira. Nossas entidades não apenas guardam dados, elas os protegem através de sanitização rigorosa.
* Infrastructure: Onde a realidade bate à porta. Usamos SQLite para persistência e Express para comunicação, sempre com defesas ativas (Helmet, Rate-limit, Sanitização).

## 🛡️ Pilares de Segurança Implementados

   1. Minimização da Área de Superfície: Sanitização via Regex em Português (PT-BR) que limpa entradas sem destruir a acentuação.
   2. Proteção de Dados: Uso obrigatório de Prepared Statements contra SQL Injection.
   3. Contratos de Confiança: Testes de contrato rigorosos que não aceitam "atalhos". Se o dado não existe ou o schema mudou, o sistema grita.

## 📜 Diário de Bordo: A Grande Garimpagem
Nossa jornada de hoje nos levou a transformar nomes de arquivos sujos (jdfud_ddfd_3edicao.pdf) em dados bibliográficos reais.
## Sprint Atual: A Semente da Realidade

* Semente (Seed): Plantamos o Curso ID 1 (Ecossistema Vimpank) para garantir que o ambiente de teste nunca seja uma miragem vazia.
* Garimpagem: Extração manual de Autor ($1), Edição ($2) e ISBN para enriquecer o banco library.db.
* Sincronia Total: O Swagger (OpenAPI 3.0) agora reflete exatamente o que o Banco de Dados e o Domínio processam.

## 🛠️ Como rodar a prova de conceito

# Para sentir a satisfação de um sistema blindado:
npm test

------------------------------
Desenvolvido por Juan Carlos – Onde a teoria encontra a prática e a miragem se torna sistema.
------------------------------

