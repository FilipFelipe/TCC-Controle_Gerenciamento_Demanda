exports.up = function (knex) {
  return knex.schema.createTable('demanda', function (table) {
    table.increments('id');
    table.float('valor').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('demanda');
};
