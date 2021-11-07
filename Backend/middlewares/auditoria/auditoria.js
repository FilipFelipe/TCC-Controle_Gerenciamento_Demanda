const knex = require('../../config/db');

module.exports = (acao, middleware) => async (req, res, next) => {
  try {
    await knex('auditoria').insert({ usuario: req.user.id, acao });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Erro interno');
  }

  middleware(req, res, next);
};
