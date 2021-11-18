const knex = require('../config/connection');
const logger = require('../logs/logger');
const calculaPotencia = require('./calculaPotencia');
const medidaMonoEBifasica = require('./model/medidaMonoEBifasica');
const medidaTrifasica = require('./model/medidaTrifasica');

module.exports = () => {
  const salvarMonoEBifasico = async (dados) => {
    const medida = medidaMonoEBifasica(dados);

    try {
      const sensorDB = await buscaSensor(
        medida.porta_tensao,
        medida.porta_corrente,
        medida.mac,
      );

      const equipamento = await buscaEquipamento(sensorDB.equipamento);

      if (!medida.tensao) {
        medida.tensao = equipamento.tensao_equipamento;
      }
      if (!sensorDB || !medida.corrente) return logger.info('Dados faltantes!');
      const medidaSalva = await salvaMedida({
        sensor: sensorDB.id,
        tensao: medida.tensao,
        corrente: medida.corrente,
      });
      const potencia = calculaPotencia([
        {
          sensor: sensorDB.id,
          tensao: medida.tensao,
          corrente: medida.corrente,
        },
      ]);
      await salvaPotencia(potencia, sensorDB.equipamento);
    } catch (error) {
      logger.error(error.message);
      return;
    }
  };

  const salvarTrifasico = async (dados) => {
    const medida = medidaTrifasica(dados);

    try {
      const sensorF1 = await buscaSensor(
        medida.porta_tensao_f1,
        medida.porta_corrente_f1,
        medida.mac,
      );

      const sensorF2 = await buscaSensor(
        medida.porta_tensao_f2,
        medida.porta_corrente_f2,
        medida.mac,
      );

      const sensorF3 = await buscaSensor(
        medida.porta_tensao_f3,
        medida.porta_corrente_f3,
        medida.mac,
      );

      const equipamento = await buscaEquipamento(sensorF1.equipamento);

      if (!medida.tensao_f1 || !medida.tensao_f2 || !medida.tensao_f3) {
        medida.tensao_f1 = equipamento.tensao_fase;
        medida.tensao_f2 = equipamento.tensao_fase;
        medida.tensao_f3 = equipamento.tensao_fase;
      }

      await salvaMedida({
        sensor: sensorF1.id,
        tensao: medida.tensao_f1,
        corrente: medida.corrente_f1,
      });

      await salvaMedida({
        sensor: sensorF2.id,
        tensao: medida.tensao_f2,
        corrente: medida.corrente_f2,
      });

      await salvaMedida({
        sensor: sensorF3.id,
        tensao: medida.tensao_f3,
        corrente: medida.corrente_f3,
      });

      const arrayMedidas = [
        { tensao: medida.tensao_f1, corrente: medida.corrente_f1 },
        { tensao: medida.tensao_f2, corrente: medida.corrente_f2 },
        { tensao: medida.tensao_f3, corrente: medida.corrente_f3 },
      ];
      const potencia = calculaPotencia(arrayMedidas);
      await salvaPotencia(potencia, sensorF1.equipamento);
    } catch (error) {
      logger.error(error.message);
    }
  };

  return { salvarMonoEBifasico, salvarTrifasico };
};

const buscaSensor = async (porta_tensao, porta_corrente, mac) => {
  return await knex
    .select('sensor.*')
    .from('dispositivo')
    .where({
      'dispositivo.mac': mac,
      'sensor.porta_tensao': porta_tensao,
      'sensor.porta_corrente': porta_corrente,
    })
    .join('sensor', 'dispositivo.id', '=', 'sensor.dispositivo')
    .first();
};

const buscaEquipamento = async (id) => {
  return await knex('equipamento').where({ id }).first();
};

const salvaMedida = async (medida) => {
  return await knex('medida').insert({
    sensor: medida.sensor,
    tensao: medida.tensao,
    corrente: medida.corrente,
  });
};

const salvaPotencia = async (potencia, equipamento) => {
  return await knex('potencia').insert({ equipamento: equipamento, potencia });
};
