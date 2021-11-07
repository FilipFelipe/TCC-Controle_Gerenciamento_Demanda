const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const listarEquipamentos = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    try {
      const equipamentoDB = await consultaPaginada('equipamento', page, limit);
      return OK(res, equipamentoDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const consultarEquipamentos = async (req, res) => {
    const id = req.params.id;
    try {
      const equipamentosDB = await app
        .knex('equipamento')
        .select()
        .where({ id: id });
      return OK(res, equipamentosDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const salvarEquipamentos = async (req, res) => {
    const { nome, prioridade, tensao_equipamento, numero_fases } = {
      ...req.body,
    };
    try {
      existsOrError(nome, 'Nome não informado');
      existsOrError(prioridade, 'Prioridade não informada');
      existsOrError(tensao_equipamento, 'Tensão do equipamento não informada');
      existsOrError(
        numero_fases,
        'Número de fases do equipamento não informado',
      );
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }

    if (numero_fases > 3 || numero_fases < 1) {
      return REQUISICAO_INVALIDA(res, 'Número de fases inválido');
    }

    let tensao_fase = null;

    if (numero_fases == 3) {
      tensao_fase = Math.floor(tensao_equipamento / Math.sqrt(3));
    }

    const equipamento = {
      nome,
      prioridade,
      tensao_equipamento,
      tensao_fase,
      numero_fases,
    };

    try {
      await app.knex('equipamento').insert(equipamento);
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const atualizarEquipamentos = async (req, res) => {
    const id = req.params.id;
    const { nome, prioridade } = { ...req.body };

    const equipamento = await app.knex('equipamento').where({ id }).first();

    if (!equipamento) {
      return REQUISICAO_INVALIDA(res, 'Equipamento não cadastrado.');
    }

    equipamento.nome = nome || equipamento.nome;
    equipamento.prioridade = prioridade || equipamento.prioridade;

    try {
      await app.knex('equipamento').update(equipamento).where({ id: id });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const deletarEquipamentos = async (req, res) => {
    const id = req.params.id;
    try {
      equipamentoDB = await app.knex('equipamento').where({ id: id }).first();
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
    if (!equipamentoDB) {
      return REQUISICAO_INVALIDA(res, 'Equipamento não cadastrado');
    }
    try {
      await app.knex('equipamento').delete().where({ id: id });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  return {
    salvarEquipamentos,
    consultarEquipamentos,
    deletarEquipamentos,
    atualizarEquipamentos,
    listarEquipamentos,
  };
};
