import mqtt from '../config/mqtt';
import knex from '../config/database';

export const enviaStatusAtuadores = async () => {
  const atuadores = await knex('atuador')
    .select('dispositivo.mac', 'atuador.porta', 'atuador.ativo')
    .innerJoin('dispositivo', 'atuador.dispositivo', 'dispositivo.id');

  atuadores.forEach((atuador) => {
    if (atuador.ativo === 1) {
      ativarAtuador(atuador.mac, atuador.porta);
    } else if (atuador.ativo === 0) {
      desativarAtuador(atuador.mac, atuador.porta);
    }
  });
};

const ativarAtuador = async (mac, porta) => {
  mqtt.publish(`/dispositivos/${mac}`, `o${porta}LIGAR`);
};

const desativarAtuador = async (mac, porta) => {
  mqtt.publish(`/dispositivos/${mac}`, `o${porta}DESLIGAR`);
};
