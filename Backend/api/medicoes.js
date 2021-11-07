const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const listarMedicoes = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    try {
      const medidasDB = await consultaPaginada('medida', page, limit);
      return OK(res, medidasDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const consultarMedicoes = async (req, res) => {
    const id = req.params.id;
    try {
      const medidasDB = await app.knex('medida').select().where({ id: id });
      return OK(res, medidasDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  return { listarMedicoes, consultarMedicoes };
};
