const OK = require('../utils/respostas/sucesso/OK');

module.exports = (app) => {
  const buscarTodas = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let numeroDeRegistros;
    try {
      numeroDeRegistros = await app.knex('sensor').count().first();
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }

    const numeroDePaginas = Math.ceil(
      parseInt(numeroDeRegistros['count(*)']) / limit,
    );

    const auditorias = await app
      .knex('auditoria')
      .join('usuario', 'auditoria.usuario', '=', 'usuario.id')
      .select(
        'usuario.id as id_usuario',
        'usuario.nome as nome_usuario',
        'auditoria.acao',
        'auditoria.criado_em',
      )
      .limit(limit)
      .offset(page * limit - limit);

    return OK(res, { data: auditorias, numeroDePaginas });
  };

  return { buscarTodas };
};
