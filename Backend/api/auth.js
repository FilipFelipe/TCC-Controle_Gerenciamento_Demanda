const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');
const PROIBIDO = require('../utils/respostas/erro_cliente/PROIBIDO');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const OK = require('../utils/respostas/sucesso/OK');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;
  const secret = process.env.SECRET;

  const login = async (req, res) => {
    const { senha, email } = req.body;

    try {
      existsOrError(email, 'E-mail não informado');
      existsOrError(senha, 'Senha não informada');
    } catch (msg) {
      return REQUISICAO_INVALIDA(res, msg);
    }
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
      return PROIBIDO(res, 'E-mail ou senha inválido!');
    }
    if (!userFromDB.ativo ) {
      return PROIBIDO(res, 'Usuário sem privilégios, contate o administrador!');
    }
    const tokenJWT = jwt.sign(
      {
        email: userFromDB.email,
        id: userFromDB.id,
      },
      secret,
    );
    return OK(res, {
      token: tokenJWT,
      administrador: userFromDB.administrador,
      user: userFromDB.nome,
      email: userFromDB.email,
    });
  };
  return { login };
};
