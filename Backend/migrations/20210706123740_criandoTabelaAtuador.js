exports.up = function (knex) {
  return knex.schema.createTable('atuador', (table) => {
    table.increments('id');
    table.integer('dispositivo').unsigned().notNullable();
    table.integer('equipamento').unsigned().notNullable();
    table.integer('porta').notNullable();
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.boolean('ativo').notNullable().defaultTo(0);

    table.foreign('dispositivo').references('id').inTable('dispositivo');
    table.foreign('equipamento').references('id').inTable('equipamento');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('atuador');
};
