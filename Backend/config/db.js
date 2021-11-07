const profile = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[profile];
const knex = require('knex')(config);

knex.migrate.latest([config]).then(() => {
  knex.seed.run([config]);
});

module.exports = knex;
