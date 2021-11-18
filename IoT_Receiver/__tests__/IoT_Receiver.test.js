const calculaPotencia = require('../src/calculaPotencia');
const medidaMonoEBifasica = require('../src/model/medidaMonoEBifasica');
const medidaTrifasica = require('../src/model/medidaTrifasica');

it('Deve calcular a potencia corretamente com uma medida', () => {
  const medida = { tensao: 127, corrente: 10 };
  const potencia = calculaPotencia([medida]);

  expect(potencia).toBe(1270);
});

it('Deve calcular a potencia corretamente com tres medidas', () => {
  const medida1 = { tensao: 127, corrente: 10 };
  const medida2 = { tensao: 127, corrente: 9 };
  const medida3 = { tensao: 127, corrente: 11 };

  const potencia = calculaPotencia([medida1, medida2, medida3]);

  expect(potencia).toBe(3810);
});

it('Deve retornar o objeto medidaMonofasica com a tensão e porta_tensao null quando a tensão não for informada', () => {
  const medida = {
    mac: '1A2B:1BC4',
    c: 10,
    pc: 3,
  };

  expect(medidaMonoEBifasica(medida)).toEqual({
    mac: '1A2B:1BC4',
    porta_tensao: null,
    porta_corrente: 3,
    tensao: null,
    corrente: 10,
  });
});

it('Deve retornar o objeto medidaMonofasica corretamente quando todos os dados forem informados', () => {
  const medida = {
    mac: '1A2B:1BC4',
    c: 10,
    pt: 2,
    t: 120,
    pc: 3,
  };

  expect(medidaMonoEBifasica(medida)).toEqual({
    mac: '1A2B:1BC4',
    porta_tensao: 2,
    porta_corrente: 3,
    tensao: 120,
    corrente: 10,
  });
});

it('Deve retornar o objeto medidaTrifasica com a tensão e porta_tensao null quando a tensão não for informada', () => {
  const medida = {
    mac: '1A2B:1BC4',
    pc1: 1,
    pc2: 3,
    pc3: 5,
    c1: 10,
    c2: 10,
    c3: 10,
  };

  expect(medidaTrifasica(medida)).toEqual({
    mac: '1A2B:1BC4',
    porta_tensao_f1: null,
    porta_corrente_f1: 1,
    porta_tensao_f2: null,
    porta_corrente_f2: 3,
    porta_tensao_f3: null,
    porta_corrente_f3: 5,
    tensao_f1: null,
    corrente_f1: 10,
    tensao_f2: null,
    corrente_f2: 10,
    tensao_f3: null,
    corrente_f3: 10,
  });
});
