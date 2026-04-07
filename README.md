# 🎵 Vim Pank - Music Control & Academy 🧬

*"Ei Linux, sou seu parente. E agora, sou seu Arquiteto."*

[![Tests](https://shields.io)](https://jestjs.io)
[![Security](https://shields.io)](#-leis-de-segurança)
[![Architecture](https://shields.io)](#-arquitetura)

---

## 🏗️ O Ecossistema Vimpank (Monorepo)

O **Vim Pank** deixou de ser apenas um controle de música para se tornar um ecossistema fullstack completo. Aqui, o código é tratado como engenharia e a segurança é o nosso alicerce.

### 🤝 Os Integrantes do Time:

- **`apps/vimpank-academy` (O Professor):** Servidor Express robusto que gerencia cursos. É aqui que aplicamos nossas leis de backend seguro.
- **`apps/music-control` (O Maestro):** O controle original de música integrado ao ecossistema.
- **`packages/core` (O Menestrel):** A inteligência que conversa com o Kernel via `child_process`.
- **`packages/library` (VimMemore):** O guardião da persistência usando **SQLite3**.

---

## 🛡️ Nossas Leis de Segurança (The Pragmatic Way)

No Vimpank, não deixamos **Janelas Quebradas**. Todo código de backend segue rigorosamente:

1. **Sanitização Universal:** Nenhuma entrada (input) entra no sistema sem ser limpa por Regex.
2. **Minimização de Superfície:** Validamos tipos (`typeof`), tamanhos (`length`) e estados antes de qualquer processamento.
3. **Resiliência:** Uso obrigatório de `try-catch` para garantir que o servidor nunca morra diante de vândalos.
4. **Diagnóstico Contínuo:** Se não tem teste, não existe. Rodamos o scanner (Jest) para garantir 100% de integridade.

---

## 🚀 Como Iniciar o Vimpank

### Para o Desenvolvedor (Modo Diagnóstico)
Para validar todo o ecossistema e ver os **20 testes de diagnóstico** brilhando em verde:
```bash
npm test
