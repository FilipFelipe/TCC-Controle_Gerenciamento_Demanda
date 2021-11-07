const app = require('express')();
require('dotenv').config();
const knex = require('./config/db');
const consign = require('consign');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.knex = knex;

consign()
  .then('./config/middlewaresConfig.js')
  .then('./utils/validation.js')
  .then('./api')
  .then('./config/routes.js')
  .into(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(5905, () => {
  console.log('Aplicação rodando na porta 5905');
});
app.listen(3333, () => {
  console.log('Aplicação rodando na porta 3333');
});
