const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const OK = require('../utils/respostas/sucesso/OK');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const bcrypt = require('bcrypt');
const PROIBIDO = require('../utils/respostas/erro_cliente/PROIBIDO');
const secret = process.env.SECRET;


module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const listarRegra = async (req, res) => {
    try {
      const ultimaRegra = await app
        .knex('*')
        .from('controle')
        .orderBy('id', 'desc')
        .first();
      return OK(res, ultimaRegra);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };
  
  const salvarRegra = async (req, res) => {
    const { controlar_demanda, tolerancia, limiar_atuacao, demanda_ponta, demanda_fora_ponta, horario_ponta, email, senha } = req.body;
    let userFromDB;
    try {
      userFromDB = await app
        .knex('usuario')
        .where({ email: email })
        .first();
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
    let resultado = false;
    if (userFromDB != undefined) {
      resultado = await bcrypt.compare(senha, userFromDB.senha);
    }
    if (!userFromDB || !resultado) {
      return PROIBIDO(res, 'Senha inválida!');
    }
    try {
      existsOrError(tolerancia, 'Tolerância não informado');
      existsOrError(limiar_atuacao, 'Limiar não informado');
      existsOrError(demanda_ponta, 'Demanda de ponta não informado');
      existsOrError(demanda_fora_ponta,'Demanda fora de ponta não informado',);
      existsOrError(horario_ponta, 'Horário de ponta não informado');
      existsOrError(email, 'Email não informado');
      existsOrError(senha, 'Senha não informada');
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }
    try {
      await app.knex('controle').insert({ controlar_demanda: controlar_demanda, tolerancia: tolerancia, limiar_atuacao: limiar_atuacao, demanda_ponta: demanda_ponta, demanda_fora_ponta: demanda_fora_ponta, horario_ponta: horario_ponta, usuario:userFromDB.id});
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  return { listarRegra, salvarRegra };
};
