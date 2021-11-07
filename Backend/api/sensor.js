const ERRO_INTERNO = require('../utils/respostas/erro_servidor/ERRO_INTERNO');
const SEM_CONTEUDO = require('../utils/respostas/sucesso/SEM_CONTEUDO');
const OK = require('../utils/respostas/sucesso/OK');
const REQUISICAO_INVALIDA = require('../utils/respostas/erro_cliente/REQUISICAO_INVALIDA');

module.exports = (app) => {
  const { existsOrError } = app.utils.validation;

  const alterar = async (req, res) => {
    const { id } = req.params;
    const { dispositivo, porta_corrente, porta_tensao } = req.body;

    const sensor = await app.knex('sensor').where({ id }).first();

    sensor.porta_tensao =
      porta_tensao !== undefined ? porta_tensao : sensor.porta_tensao;
    sensor.porta_corrente =
      porta_corrente !== undefined ? porta_corrente : sensor.porta_corrente;
    sensor.dispositivo = dispositivo || sensor.dispositivo;

    if (porta_corrente !== undefined) {
      const porta_corrente_invalida = await app
        .knex('sensor')
        .where({ dispositivo: sensor.dispositivo })
        .andWhere(function () {
          this.where({ porta_corrente: sensor.porta_corrente }).orWhere({
            porta_tensao: sensor.porta_corrente,
          });
        })
        .first();

      if (porta_corrente_invalida) {
        return REQUISICAO_INVALIDA(
          res,
          `A porta ${sensor.porta_corrente} do dispositivo ${sensor.dispositivo} já está em uso`,
        );
      }
    }

    if (porta_tensao !== undefined) {
      const porta_tensao_invalida = await app
        .knex('sensor')
        .where({ dispositivo: sensor.dispositivo })
        .andWhere(function () {
          this.where({ porta_corrente: sensor.porta_tensao }).orWhere({
            porta_tensao: sensor.porta_tensao,
          });
        })
        .first();

      if (porta_tensao_invalida) {
        return REQUISICAO_INVALIDA(
          res,
          `A porta ${sensor.porta_tensao} do dispositivo ${sensor.dispositivo} já está em uso`,
        );
      }
    }

    const dispositivoValido = await app
      .knex('dispositivo')
      .where({ id: sensor.dispositivo, ativo: true })
      .first();

    if (!dispositivoValido) {
      return REQUISICAO_INVALIDA(res, 'Dispositivo inválido');
    }

    try {
      await app.knex('sensor').update(sensor).where({ id });
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }

    return SEM_CONTEUDO(res);
  };

  const salvar = async (req, res) => {
    const {
      dispositivo,
      equipamento,
      porta_tensao,
      porta_corrente,
      sensor_principal,
    } = req.body;

    try {
      existsOrError(
        dispositivo,
        'Informe o dispositivo que o sensor está conectado',
      );
      existsOrError(
        equipamento,
        'Informe o equipamento que o sensor está conectado',
      );
      existsOrError(
        porta_corrente,
        'Informe a porta que o sensor de corrente está conectado',
      );
    } catch (error) {
      return REQUISICAO_INVALIDA(res, error);
    }

    const dispositivoDB = await app
      .knex('dispositivo')
      .where({ id: dispositivo, ativo: true })
      .first();

    const equipamentoDB = await app
      .knex('equipamento')
      .where({ id: equipamento })
      .first();

    const portaCorrenteOcupada = await app
      .knex('sensor')
      .where({ dispositivo, porta_corrente })
      .first();

    if (portaCorrenteOcupada) {
      return REQUISICAO_INVALIDA(
        res,
        `A porta ${porta_corrente} já está em uso`,
      );
    }

    if (porta_tensao) {
      const portaTensaoOcupada = await app
        .knex('sensor')
        .where({ dispositivo, porta_tensao })
        .first();
      if (portaTensaoOcupada) {
        return REQUISICAO_INVALIDA(
          res,
          `A porta ${porta_tensao} já está em uso`,
        );
      }
    }

    if (!dispositivoDB) {
      return REQUISICAO_INVALIDA(res, 'Informe um dispositivo válido');
    }
    if (!equipamentoDB) {
      return REQUISICAO_INVALIDA(res, 'Informe um equipamento válido');
    }

    const novoSensor = {
      dispositivo,
      equipamento,
      porta_tensao,
      porta_corrente,
      sensor_principal,
    };

    try {
      await app.knex('sensor').insert(novoSensor);
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const buscarTodos = async (req, res) => {
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

    try {
      const sensores = await app
        .knex('sensor')
        .join('equipamento', 'sensor.equipamento', '=', 'equipamento.id')
        .join('dispositivo', 'sensor.dispositivo', '=', 'dispositivo.id')
        .join('tipo', 'sensor.tipo', '=', 'tipo.id')
        .join('local', 'dispositivo.local', '=', 'local.id')
        .select(
          'sensor.id',
          'sensor.porta',
          'equipamento.nome AS equipamento',
          'local.nome AS local',
          'tipo.nome AS tipo',
        )
        .limit(limit)
        .offset(page * limit - limit);

      return OK(res, { data: sensores, numeroDePaginas });
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const deletar = async (req, res) => {
    const { id } = req.params;

    const sensorDB = await app
      .knex('sensor')
      .select()
      .where({ id })
      .first()
      .catch((err) => ERRO_INTERNO(res, err));

    if (!sensorDB) {
      return REQUISICAO_INVALIDA(res, 'Informe um id válido para o sensor');
    }
    try {
      await app.knex('sensor').update({ dispositivo: null }).where({ id });
      return SEM_CONTEUDO(res);
    } catch (error) {
      return ERRO_INTERNO(res, error);
    }
  };

  const buscarUm = async (req, res) => {
    const { id } = req.params;

    const sensor = await app
      .knex('sensor')
      .select()
      .where({ id })
      .first()
      .catch((err) => ERRO_INTERNO(res, err));

    if (!sensor) {
      return REQUISICAO_INVALIDA(res, 'Informe um id válido para o sensor');
    }
    return OK(res, sensor);
  };

  return { salvar, buscarTodos, alterar, deletar, buscarUm };
};
