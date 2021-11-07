const consultaPaginada = require('../utils/consultaPaginada');
const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const listarDemanda = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
      const demandaDB = await consultaPaginada('demanda', page, limit);
      return OK(res, demandaDB);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const demandaMedia = async (req, res) => {
    let dataInicio = req.query.inicio || formatarData(new Date());
    let dataFim = req.query.fim || formatarData(new Date());

    dataInicio += ' 00:00:00';
    dataFim += ' 23:59:59';

    try {
      let media = await app
        .knex('demanda')
        .avg('valor')
        .whereBetween('criado_em', [dataInicio, dataFim])
        .first();
      media = media['avg(`valor`)'];
      return OK(res, { data_inicio: dataInicio, data_fim: dataFim, media });
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const formatarData = (date) => {
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  };
  const teste = async (req, res) => {

    try {
      const demanda = await app.knex('*').column('valor', 'criado_em').from('demanda').orderBy('id').limit(7);
      const controle = await app.knex('*').column('controlar_demanda').from('controle').orderBy('id', 'desc').limit(1);
      let demanda_min = []
      for (let index = 0; index < demanda.length; index++) {
        demanda_min.push({ name: demanda[index].criado_em.toLocaleString().substr(11, 5) , Demanda: + demanda[index].valor })
      }
      demanda_min.reverse();
      const data_media = [{ name: 'Seg', Demanda: getRandomArbitrary() }, { name: 'Ter', Demanda: getRandomArbitrary() }, { name: 'Qua', Demanda: getRandomArbitrary() }, { name: 'Qui', Demanda: getRandomArbitrary() }, { name: 'Sex', Demanda: getRandomArbitrary() }, { name: 'Sáb', Demanda: getRandomArbitrary() }, { name: 'Dom', Demanda: getRandomArbitrary() }];
      return OK(res, [{ media_dias: data_media, media_min: demanda_min, ultimaDemanda: demanda[0].valor, controle_status: controle[0].controlar_demanda }]);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  function getRandomArbitrary() {
    return Math.ceil(Math.random() * (500 - 10) + 10);
  }
  return {
    demandaMedia,
    listarDemanda,
    teste,
  };
};
