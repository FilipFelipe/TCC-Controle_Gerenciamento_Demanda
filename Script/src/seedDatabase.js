import knex from '../config/database';

export default async () => {
  await knex('demanda').del();
  await knex('potencia').del();
  await knex('atuador').del();
  await knex('medida').del();
  await knex('sensor').del();
  await knex('equipamento').del();
  await knex('dispositivo').del();
  await knex('local').del();

  let idLocal1;
  let idLocal2;
  try {
    idLocal1 = await knex('local').insert({ nome: 'Patio 1', ativo: 1 });
    idLocal2 = await knex('local').insert({ nome: 'Patio 2', ativo: 1 });
  } catch (error) {
    console.log(error);
  }

  let idDispositivo1;
  let idDispositivo2;

  try {
    idDispositivo1 = await knex('dispositivo').insert({
      local: idLocal1,
      ativo: 1,
      mac: '00:E0:4C:63:A3:8B',
      operante: 1,
    });
    idDispositivo2 = await knex('dispositivo').insert({
      local: idLocal2,
      ativo: 1,
      mac: '00:E0:4C:76:67:E2',
      operante: 1,
    });
  } catch (error) {
    console.log(error);
  }

  let idEquipamento1;
  let idEquipamento2;
  let idEquipamento3;

  try {
    idEquipamento1 = await knex('equipamento').insert({
      nome: 'Entrada',
      prioridade: 0,
      tensao_equipamento: 380,
      tensao_fase: 220,
      ativo: 1,
      entrada: 1,
      numero_fases: 3,
    });
    idEquipamento2 = await knex('equipamento').insert({
      nome: 'Equipamento 1',
      prioridade: 1,
      tensao_equipamento: 220,
      tensao_fase: null,
      ativo: 1,
      entrada: 0,
      numero_fases: 1,
    });
    idEquipamento3 = await knex('equipamento').insert({
      nome: 'Equipamento 2',
      prioridade: 2,
      tensao_equipamento: 220,
      tensao_fase: null,
      ativo: 1,
      entrada: 0,
      numero_fases: 1,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await knex('sensor').insert({
      dispositivo: idDispositivo1,
      equipamento: idEquipamento1,
      porta_tensao: 1,
      porta_corrente: 2,
    });
    await knex('sensor').insert({
      dispositivo: idDispositivo1,
      equipamento: idEquipamento1,
      porta_tensao: 3,
      porta_corrente: 4,
    });
    await knex('sensor').insert({
      dispositivo: idDispositivo1,
      equipamento: idEquipamento1,
      porta_tensao: 5,
      porta_corrente: 6,
    });
    await knex('sensor').insert({
      dispositivo: idDispositivo2,
      equipamento: idEquipamento2,
      porta_tensao: null,
      porta_corrente: 1,
    });
    await knex('sensor').insert({
      dispositivo: idDispositivo2,
      equipamento: idEquipamento3,
      porta_tensao: 2,
      porta_corrente: 3,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    await knex('atuador').insert({
      dispositivo: idDispositivo2,
      equipamento: idEquipamento2,
      porta: 10,
      ativo: 1,
    });
    await knex('atuador').insert({
      dispositivo: idDispositivo2,
      equipamento: idEquipamento3,
      porta: 11,
      ativo: 1,
    });
  } catch (error) {}
};
