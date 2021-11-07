module.exports = {
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST,
      user: process.env.DATABASE_USER,
      port: process.env.DATABASE_PORT,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds/prod',
    },
  },
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },
};
