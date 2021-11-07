const bcrypt = require('bcrypt');

exports.seed = function (knex) {
  const encryptPassword = (senha) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt);
  };

  knex('usuario')
    .select()
    .where({ email: 'admin@admin.com' })
    .first()
    .then((admin) => {
      if (!admin) {
        return knex('usuario')
          .del()
          .then(function () {
            return knex('usuario').insert([
              {
                email: 'admin@admin.com',
                senha: encryptPassword('admin'),
                nome: 'admin',
                ativo: true,
                administrador: true,
              },
            ]);
          });
      }
    });
};
