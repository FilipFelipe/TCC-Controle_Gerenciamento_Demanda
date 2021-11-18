module.exports = (dados) => {
  const { mac, pt1, pc1, pt2, pc2, pt3, pc3, t1, c1, t2, c2, t3, c3 } = dados;

  return {
    mac,
    porta_tensao_f1: pt1 || null,
    porta_corrente_f1: pc1,
    porta_tensao_f2: pt2 || null,
    porta_corrente_f2: pc2,
    porta_tensao_f3: pt3 || null,
    porta_corrente_f3: pc3,
    tensao_f1: t1 || null,
    corrente_f1: c1,
    tensao_f2: t2 || null,
    corrente_f2: c2,
    tensao_f3: t3 || null,
    corrente_f3: c3,
  };
};
