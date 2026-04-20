
function contarAteCinco(){
	const resultado = [];

	for(let i = 1; i <= 5; i++) {
	 console.log(`Iteracao ${i}: o valor de i é ${i}`);
	 resultado.push(i);
  }


  return resultado;
}

module.exports = { contarAteCinco }
