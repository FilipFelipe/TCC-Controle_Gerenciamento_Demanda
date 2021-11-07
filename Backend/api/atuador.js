const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const listarAtuador = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    try {
      const atuadorDB = await consultaPaginada('atuador', page, limit);
      return OK(res, atuadorDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const consultarAtuador = async (req, res) => {
    const id = req.params.id;
    try {
      const atuadorDB = await app
        .knex('atuador')
        .select()
        .where({ id: id })
        .first();
      return OK(res, atuadorDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const salvarAtuador = async (req, res) => {
    const { dispositivo, equipamento, porta } = req.body;
    try {
      existsOrError(dispositivo, 'Id do dispositivo não informado');
      existsOrError(equipamento, 'Id do equipamento não informado');
      existsOrError(porta, 'porta não informado');
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }

    const dispositivoDB = await app
      .knex('dispositivo')
      .where({ id: dispositivo })
      .first();
    const equipamentoDB = await app
      .knex('equipamento')
      .where({ id: equipamento })
      .first();

    if (!equipamentoDB) {
      return REQUISICAO_INVALIDA(
        res,
        'Informe um id válido para o equipamento',
      );
    }
    if (!dispositivoDB) {
      return REQUISICAO_INVALIDA(
        res,
        'Informe um id válido para o dispositivo',
      );
    }

    try {
      await app.knex('atuador').insert({ dispositivo: dispositivo, equipamento: equipamento, porta: porta });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const atualizarAtuador = async (req, res) => {
    const id = req.params.id;
    const { dispositivo, equipamento, porta } = req.body;

    const dispositivoDB = await app
      .knex('dispositivo')
      .where({ id: dispositivo })
      .first();
    const equipamentoDB = await app
      .knex('equipamento')
      .where({ id: equipamento })
      .first();

    if (!equipamentoDB) {
      return REQUISICAO_INVALIDA(
        res,
        'Informe um id válido para o equipamento',
      );
    }
    if (!dispositivoDB) {
      return REQUISICAO_INVALIDA(
        res,
        'Informe um id válido para o dispositivo',
      );
    }

    if (id) {
      const atuadorDB = await app.knex('atuador').where({ id: id }).first();
      if (!atuadorDB) {
        return REQUISICAO_INVALIDA(res, 'Informe o ID válido');
      }
    }
    try {
      existsOrError(dispositivo, 'Id do dispositivo não informado');
      existsOrError(equipamento, 'Id do equipamento não informado');
      existsOrError(porta, 'porta não informado');
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }
    try {
      await app.knex('atuador').update({ dispositivo: dispositivo, equipamento: equipamento, porta: porta }).where({ id: id });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  return {
    salvarAtuador,
    consultarAtuador,
    atualizarAtuador,
    listarAtuador,
  };
};
