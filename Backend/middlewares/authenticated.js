const jwt = require('jsonwebtoken');
const knex = require('../config/db');
module.exports = async function (req, res, next) {
  const authToken = req.headers['authorization'];
  const secret = process.env.SECRET;
  if (authToken != undefined) {
    const bearer = authToken.split(' ');
    const token = bearer[1];
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded) {
        try {
          userFromDB = await knex.select('id', 'email', 'ativo', 'administrador').from('usuario').where({ email: decoded.email }).first();
        } catch (error) {
          console.log(error);
        }
        if (userFromDB.ativo) {
          req.user = userFromDB;
          next();
        } else {
          res.status(403);
          res.send('Usuário não ativo!');
        }

      } else {
        res.status(403);
        res.send('Token inválido!');
        return;
      }
    } catch (error) {
      res.status(403);
      res.send('Token inválido!');
      return;
    }
  } else {
    res.status(401);
    res.send('Usuário não autenticado');
    return;
  }
};