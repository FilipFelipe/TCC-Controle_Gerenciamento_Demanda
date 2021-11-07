const knex = require('../config/db');

module.exports = async (
  tabela,
  pagina = 1,
  numeroDeRegistrosPagina = 20,
  campos = '*',
  filtro = true,
) => {
  const numeroDeRegistros = await knex(tabela).count().first();

  const numeroDePaginas = Math.ceil(
    parseInt(numeroDeRegistros['count(*)']) / numeroDeRegistrosPagina,
  );

  const data = await knex(tabela)
    .select(campos)
    .limit(numeroDeRegistrosPagina)
    .where(filtro)
    .offset(pagina * numeroDeRegistrosPagina - numeroDeRegistrosPagina);
  return { data, numeroDePaginas };
};
