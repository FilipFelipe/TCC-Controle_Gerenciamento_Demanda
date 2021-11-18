module.exports = (medidas) => {
  return medidas
    .map((medida) => medida.tensao * medida.corrente)
    .reduce((total, potencia) => {
      return total + potencia;
    }, 0);
};
