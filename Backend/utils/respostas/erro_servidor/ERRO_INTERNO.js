const logger = require('pino')();

module.exports = (res, error) => {
  logger.error(error);
  return res.status(500).json({ msg: 'Erro interno, contate o administrador' });
};
