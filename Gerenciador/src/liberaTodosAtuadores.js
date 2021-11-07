import knex from '../config/database';
import { enviaStatusAtuadores } from './MQTTSender';

export default async () => {
  await knex('atuador').update({ ativo: 1 });
  await enviaStatusAtuadores();
};
