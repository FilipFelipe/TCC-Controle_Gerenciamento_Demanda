module.exports = (dados) => {
  const { mac, pt, pc, t, c } = dados;
  return {
    mac,
    porta_tensao: pt || null,
    porta_corrente: pc,
    tensao: t || null,
    corrente: c,
  };
};
