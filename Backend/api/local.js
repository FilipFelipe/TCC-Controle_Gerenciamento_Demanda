const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const salvar = async (req, res) => {
    const { nome } = req.body;

    try {
      existsOrError(nome, 'Informe um nome para o local do dispositivo');
    } catch (msg) {
      return REQUISICAO_INVALIDA(res, error);
    }

    try {
      await app.knex('local').insert({ nome, ativo: true });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const buscarTodos = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
      const localDB = await consultaPaginada('local', page, limit);
      return OK(res, localDB);
    } catch (error) {
      return ERRO_INTERNO(res, err);
    }
  };

  return { salvar, buscarTodos };
};
