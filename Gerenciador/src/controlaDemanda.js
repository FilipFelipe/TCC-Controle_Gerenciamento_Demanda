import knex from '../config/database';
import { enviaStatusAtuadores } from './MQTTSender';

const prioridadesDesligadas = [];

export const controlaDemanda = async (demandaAtual, demandaMaxima) => {
  const valorAbaixoDoMaximo = demandaMaxima - demandaAtual;

  if (valorAbaixoDoMaximo < 0) {
    await desativaCargas(-valorAbaixoDoMaximo);
  } else {
    await ativaCargas(valorAbaixoDoMaximo);
  }
  console.log(valorAbaixoDoMaximo);
  enviaStatusAtuadores();
};

export const desativaCargas = async (valorUltrapassado) => {
  const potenciaMediaPorPrioridade = await knex('potencia')
    .select('equipamento.prioridade')
    .avg('potencia.potencia as potencia_media')
    .innerJoin('equipamento', 'potencia.equipamento', 'equipamento.id')
    .whereNotIn('equipamento.prioridade', prioridadesDesligadas)
    .where('equipamento.prioridade', '>', 0)
    .groupBy('equipamento.prioridade')
    .orderBy('equipamento.prioridade', 'desc');

  let valor = valorUltrapassado;
  let i = 0;
  while (valor > 0 && i < potenciaMediaPorPrioridade.length) {
    prioridadesDesligadas.push(potenciaMediaPorPrioridade[i].prioridade);
    valor -= potenciaMediaPorPrioridade[i].potencia_media;
    i++;
  }
  console.log(prioridadesDesligadas);

  const atuadores = await knex('atuador')
    .select('atuador.id')
    .innerJoin('equipamento', 'atuador.equipamento', 'equipamento.id')
    .innerJoin('dispositivo', 'atuador.dispositivo', 'dispositivo.id')
    .whereIn('equipamento.prioridade', prioridadesDesligadas);

  const idAtuadores = atuadores.map((atuador) => atuador.id);

  await knex('atuador').update({ ativo: 0 }).whereIn('id', idAtuadores);
};

export const ativaCargas = async (valorAbaixoDoMaximo) => {
  let valor = valorAbaixoDoMaximo;

  const potenciaMediaPorPrioridade = await knex('potencia')
    .select('equipamento.prioridade')
    .avg('potencia.potencia as potencia_media')
    .innerJoin('equipamento', 'potencia.equipamento', 'equipamento.id')
    .whereIn('equipamento.prioridade', prioridadesDesligadas)
    .where('equipamento.prioridade', '>', 0)
    .groupBy('equipamento.prioridade')
    .orderBy('equipamento.prioridade', 'asc');

  while (prioridadesDesligadas.length > 0) {
    if (valor - potenciaMediaPorPrioridade[0].potencia_media >= 0) {
      valor -= potenciaMediaPorPrioridade[0].potencia_media;
      potenciaMediaPorPrioridade.shift();
      prioridadesDesligadas.pop();
    } else {
      break;
    }
  }

  const atuadores = await knex('atuador')
    .select('atuador.id')
    .innerJoin('equipamento', 'atuador.equipamento', 'equipamento.id')
    .innerJoin('dispositivo', 'atuador.dispositivo', 'dispositivo.id')
    .whereNotIn('equipamento.prioridade', prioridadesDesligadas);

  const idAtuadores = atuadores.map((atuador) => atuador.id);

  await knex('atuador').update({ ativo: 1 }).whereIn('id', idAtuadores);
};
