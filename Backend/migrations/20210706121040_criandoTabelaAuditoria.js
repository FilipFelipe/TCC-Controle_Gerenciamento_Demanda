exports.up = function (knex) {
    return knex.schema.createTable('auditoria', function (table) {
        table.increments('id');
        table.integer('usuario').unsigned().notNullable();
        table.foreign('usuario').references('id').inTable('usuario');
        table.string('acao').notNullable();
        table.timestamp('criado_em').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('auditoria');
};
