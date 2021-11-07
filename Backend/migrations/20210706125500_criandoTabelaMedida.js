exports.up = function (knex) {
  return knex.schema.createTable('medida', (table) => {
    table.increments('id');
    table.integer('sensor').unsigned().notNullable();
    table.float('tensao').notNullable();
    table.float('corrente').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());

    table.foreign('sensor').references('id').inTable('sensor');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('medida');
};
