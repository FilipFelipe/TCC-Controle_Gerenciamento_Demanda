const bcrypt = require('bcrypt');
const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError, equalsOrError } = app.utils.validation;

  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const salvarUsuario = async (req, res) => {
    let { nome, email, senha, confirmarSenha } = req.body;
    const ativo = true;
    let userFromDB;

    try {
      existsOrError(nome, 'Nome não informado');
      existsOrError(email, 'E-mail não informado');
      existsOrError(senha, 'Senha não informada');
      existsOrError(confirmarSenha, 'Confirmação de Senha inválida');
      equalsOrError(senha, confirmarSenha, 'Senhas não conferem');
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }
    try {
      userFromDB = await app
        .knex('usuario')
        .where({ email: email })
        .first();
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
    if (userFromDB) {
      return REQUISICAO_INVALIDA(res, 'Usuário já cadastrado');
    }
    senha = encryptPassword(senha);
    delete confirmarSenha;
    try {
      await app
        .knex('usuario').insert([{ nome: nome, email: email, senha: senha, ativo: ativo }]);
      SEM_CONTEUDO(res)
    } catch (error) {
      ERRO_INTERNO(res, error)
    }
  };

  const listarUsuarios = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const tipo = req.query.tipo
    if (tipo === 'inativo') {
      try {
        const usuariosDB = await app
          .knex('usuario')
          .where({ ativo: false })
          .select(["id", "nome", "email", "ativo", "administrador"]);
        return OK(res, usuariosDB);
      } catch (error) {
        return ERRO_INTERNO(res, error);
      }
    }
    try {
      const usuariosDB = await consultaPaginada('usuario', page, limit, ["id", "nome", "email", "ativo", "administrador"], { ativo: true });
      return OK(res, usuariosDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const atualizarUsuario = async (req, res) => {
    let { id } = req.params;
    const { ativo, administrador, nome, senha, confirmarSenha } = req.body;
    try {
      equalsOrError(senha, confirmarSenha, 'As senhas informadas são diferentes')
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }

    let userFromDB;

    try {
      userFromDB = await app.knex('usuario').where({ id: id }).first();
    } catch (error) {
      return ERRO_INTERNO(res, error)
    }
    if (!userFromDB) {
      return REQUISICAO_INVALIDA(res, 'Usuário não existe!');
    }

    if (ativo !== undefined && req.user.id === userFromDB.id) {
      return REQUISICAO_INVALIDA(res, 'Não é possível alterar o status de ativo de si mesmo');
    }

    userFromDB.senha = senha ? encryptPassword(senha) : userFromDB.senha;
    userFromDB.nome = nome ? nome : userFromDB.nome;
    userFromDB.ativo = ativo !== undefined ? ativo : userFromDB.ativo;
    userFromDB.administrador = administrador ? administrador : userFromDB.administrador;

    try {
      app
        .knex('usuario')
        .update({ ...userFromDB })
        .where({ id: id })
        .then((_) => res.status(204).send())
        .catch((err) => ERRO_INTERNO(res, error));
    } catch (error) {
      console.log(error);
    }
  };

  const consultarUsuario = async (req, res) => {
    const id = req.params.id;
    try {
      const usuarioDB = await app
        .knex('usuario')
        .select(["id", "nome", "email", "ativo", "administrador"])
        .where({ id: id }).first();
      if (!usuarioDB) {
        return REQUISICAO_INVALIDA(res, 'Usuário não encontrado');
      }
      return OK(res, usuarioDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }

  };

  const uploadFotoUsuario = async (req, res) => {
    res.send('ok')
  };

  return { salvarUsuario, listarUsuarios, atualizarUsuario, consultarUsuario, uploadFotoUsuario };
};
