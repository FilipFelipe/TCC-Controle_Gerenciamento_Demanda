exports.up = function (knex) {
  return knex.schema.createTable('dispositivo', (table) => {
    table.increments('id');
    table.integer('local').unsigned().notNullable();
    table.boolean('ativo').defaultTo(1).notNullable();
    table.string('mac', 20).unique().notNullable();
    table.boolean('operante').defaultTo(1).notNullable();
    table.string('observacao', 1000);
    table.timestamp('criado_em').defaultTo(knex.fn.now());

    table.foreign('local').references('id').inTable('local');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('dispositivo');
};
