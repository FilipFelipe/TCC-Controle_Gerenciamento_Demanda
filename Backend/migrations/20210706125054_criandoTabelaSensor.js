exports.up = function (knex) {
  return knex.schema.createTable('sensor', (table) => {
    table.increments('id');
    table.integer('dispositivo').unsigned();
    table.integer('equipamento').unsigned();
    table.integer('porta_tensao').defaultTo(null);
    table.integer('porta_corrente').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());

    table.foreign('dispositivo').references('id').inTable('dispositivo');
    table.foreign('equipamento').references('id').inTable('equipamento');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('sensor');
};
