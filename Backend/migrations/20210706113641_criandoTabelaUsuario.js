exports.up = function (knex) {
  return knex.schema.createTable('usuario', function (table) {
    table.increments('id');
    table.string('email').unique().notNullable();
    table.string('senha').notNullable();
    table.string('nome').notNullable();
    table.boolean('ativo').notNullable();
    table.boolean('administrador').defaultTo(0).notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuario');
};
