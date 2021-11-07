exports.up = function (knex) {
  return knex.schema.createTable('equipamento', (table) => {
    table.increments('id');
    table.string('nome').notNullable();
    table.integer('prioridade').notNullable();
    table.float('tensao_equipamento').notNullable();
    table.float('tensao_fase');
    table.boolean('ativo').defaultTo(1).notNullable();
    table.boolean('entrada').defaultTo(1).notNullable();
    table.integer('numero_fases').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('equipamento');
};
