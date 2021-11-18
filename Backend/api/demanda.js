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
  const listarDashboard = async (req, res) => {

    try {
      let demanda_tempo = []
      let media_dia = [0, 0, 0, 0, 0, 0, 0]
      const demanda = await app.knex('*').column('valor', 'criado_em').from('demanda').orderBy('id').limit(7);
      const controle = await app.knex('*').column('controlar_demanda').from('controle').orderBy('id', 'desc').limit(1);
      const monitoramento = await app.knex('*').sum('ativo as number').from('dispositivo').where({ operante: 1 });
      console.log(monitoramento[0].number);
      if (monitoramento[0].number != null){
        monitoramento.controle = 1;
      }else{
        monitoramento.controle = 0;
      }
      const mediaQuery = await app.knex.raw('SELECT round(AVG( valor ),2) as MediaDia , DAY( `criado_em` ) as Dia, criado_em as Data FROM demanda WHERE DATE_SUB(  `criado_em` , INTERVAL 1 DAY ) GROUP BY DAY( `criado_em` ) DESC LIMIT 7;');
      const media = mediaQuery[0];
      for (let i = 0; i < media.length; i++) {
        media_dia[media[i].Data.getDay()] = media[i].MediaDia;
      }
      for (let index = 0; index < demanda.length; index++) {
        demanda_tempo.push({ name: demanda[index].criado_em.toLocaleString().substr(11, 5) , Demanda: + demanda[index].valor })
      }
      demanda_tempo.reverse();
      const data_media = [{ name: 'Seg', Demanda: media_dia[1] }, { name: 'Ter', Demanda: media_dia[2] }, { name: 'Qua', Demanda: media_dia[3] }, { name: 'Qui', Demanda: media_dia[4] }, { name: 'Sex', Demanda: media_dia[5] }, { name: 'Sáb', Demanda: media_dia[6] }, { name: 'Dom', Demanda: media_dia[0] }];
      return OK(res, [{ media_dias: data_media, media_min: demanda_tempo, ultimaDemanda: demanda[0].valor, controle_status: controle[0].controlar_demanda, controle_monitoramento: monitoramento.controle }]);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  return {
    demandaMedia,
    listarDemanda,
    listarDashboard,
  };
};
