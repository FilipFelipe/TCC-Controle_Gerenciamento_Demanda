exports.up = function (knex) {
  return knex.schema.createTable('potencia', (table) => {
    table.increments('id');
    table.integer('equipamento').unsigned().notNullable();
    table.float('potencia').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());

    table.foreign('equipamento').references('id').inTable('equipamento');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('potencia');
};
