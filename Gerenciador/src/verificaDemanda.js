import { scheduleJob } from 'node-schedule';
import knex from '../config/database';
import moment from 'moment';
import { controlaDemanda } from './controlaDemanda';

export default scheduleJob('*/1 * * * *', async () => {
  const { limiar_atuacao } = await knex('controle')
    .select('limiar_atuacao')
    .orderBy('criado_em', 'desc')
    .first();
  const demandaMaxima = (await demandaMaximaAtual()) * (limiar_atuacao / 100);
  const demandaAtual = await demandaMedia();

  await knex('demanda').insert({
    valor: demandaAtual.potencia || 0,
  });
  controlaDemanda(demandaAtual.potencia, demandaMaxima);
});

const demandaMedia = async () => {
  const ago = moment().subtract(15, 'minutes').format();
  const now = moment().format();

  return await knex('potencia')
    .innerJoin('equipamento', 'potencia.equipamento', 'equipamento.id')
    .avg('potencia.potencia as potencia')
    .where({ 'equipamento.entrada': 1 })
    .whereBetween('potencia.criado_em', [ago, now])
    .first();
};

const demandaMaximaAtual = async () => {
  const controle = await knex('controle').orderBy('criado_em', 'desc').first();

  const inicio_ponta = moment(controle.horario_ponta, 'HH:mm:ss').format();
  const fim_ponta = moment(inicio_ponta).add(3, 'hours').format();

  const horario_atual = moment();

  const horario_ponta = horario_atual.isBetween(
    moment(inicio_ponta),
    moment(fim_ponta),
  );

  return horario_ponta ? controle.demanda_ponta : controle.demanda_fora_ponta;
};
