require('dotenv').config();
const profile = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[profile];
const knex = require('knex')(config);
export default knex;
