const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const alterar = async (req, res) => {
    let { id } = req.params;
    let { ativo, local } = req.body;

    if (ativo !== undefined) {
      if (ativo > 0) {
        ativo = true;
      } else {
        ativo = false;
      }
    }

    const dispositivoDB = await app.knex('dispositivo').where({ id }).first();

    if (dispositivoDB) {
      dispositivoDB.ativo = ativo !== undefined ? ativo : dispositivoDB.ativo;
      if (local) {
        const novoLocal = await app.knex('local').where({ id: local }).first();
        if (!novoLocal) {
          return REQUISICAO_INVALIDA(res, 'Informe um local válido');
        }
      }
      dispositivoDB.local = local;
    } else {
      return REQUISICAO_INVALIDA(res, 'Dispositivo não encontrado');
    }

    try {
      await app
        .knex('dispositivo')
        .update(dispositivoDB)
        .where({ id: dispositivoDB.id });
        return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const salvar = async (req, res) => {
    const { mac, local } = req.body ;

    try {
      existsOrError(mac, 'Informe um MAC.');
      existsOrError(local, 'Informe o local do dispositivo.');
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }

    const buscaLocal = await app.knex('local').where({ id: local }).first();

    if (!buscaLocal) {
      return REQUISICAO_INVALIDA(res, 'Informe um local válido');
    }

    const buscaDispositivo = await app
      .knex('dispositivo')
      .where({ mac:mac })
      .first();

    if (buscaDispositivo) {
      return REQUISICAO_INVALIDA(res, 'Dispositivo já cadastrado');
    }

    const novoDispositivo = { local, mac };
    novoDispositivo.ativo = true;
    novoDispositivo.operante = true;

    try {
      await app.knex('dispositivo').insert(novoDispositivo);
      return SEM_CONTEUDO(res);
    } catch (error) {
      ERRO_INTERNO(res, err);
    }
  };

  const buscarTodos = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
      const dispositivosDB = await consultaPaginada('dispositivo', page, limit);
      return OK(res, dispositivosDB);
    } catch (error) {
      ERRO_INTERNO(res, err);
    }
  };

  const buscarUm = async (req, res) => {
    const { id } = req.params;

    const dispositivosDB = await app.knex('dispositivo').where({ id }).first();
    if (!dispositivosDB) {
      return REQUISICAO_INVALIDA(res, 'Dispositivo não encontrado');
    }
    return res.status(200).json(dispositivosDB);
  };

  return {
    salvar,
    buscarTodos,
    alterar,
    buscarUm,
  };
};
