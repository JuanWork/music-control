// packages/core/src/index.js

/**
 * Função simples para testar nossa arquitetura
*/

function saudar(nome){
  if (!nome) return "Olá, Visitante!";
  return `Olá, ${nome}! Bem-vindo ao ecossistema Vimpank.`;
}

// chamada da função automática
module.exports = {saudar};
