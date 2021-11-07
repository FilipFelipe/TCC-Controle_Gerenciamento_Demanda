exports.up = function (knex) {
  return knex.schema.createTable('local', (table) => {
    table.increments('id');
    table.string('nome', 30).unique().notNullable();
    table.boolean('ativo').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('local');
};
