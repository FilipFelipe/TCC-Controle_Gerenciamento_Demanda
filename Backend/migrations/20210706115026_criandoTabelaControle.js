exports.up = function (knex) {
  return knex.schema.createTable('controle', function (table) {
    table.increments('id');
    table.float('tolerancia').notNullable();
    table.float('limiar_atuacao').notNullable();
    table.float('demanda_ponta').notNullable();
    table.float('demanda_fora_ponta').notNullable();
    table.time('horario_ponta').notNullable();
    table.boolean('controlar_demanda').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.integer('usuario').unsigned().notNullable();
    table.foreign('usuario').references('id').inTable('usuario');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('controle');
};
