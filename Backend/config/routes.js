const authenticated = require('../middlewares/authenticated');
const admin = require('../middlewares/admin');
const auditoria = require('../middlewares/auditoria/auditoria');
const multer = require('multer');
const multerConfig = require('../middlewares/multer');
const {
  CRIAR_USUARIO,
  ATUALIZAR_USUARIO,
} = require('../middlewares/auditoria/acoes');

module.exports = (app) => {
  app.route('/login').post(app.api.auth.login);

  app
    .route('/medicoes')
    .all(authenticated)
    .get(app.api.medicoes.listarMedicoes);

  app
    .route('/medicoes/:id')
    .all(authenticated)
    .get(app.api.medicoes.consultarMedicoes);

  app.route('/demanda').all(authenticated).get(app.api.demanda.listarDemanda);

  app
    .route('/demanda/media')
    .all(authenticated)
    .get(app.api.demanda.demandaMedia);

  app
    .route('/dispositivo')
    .all(authenticated)
    .post(app.api.dispositivo.salvar)
    .get(app.api.dispositivo.buscarTodos);

  app
    .route('/dispositivo/:id')
    .all(authenticated)
    .put(app.api.dispositivo.alterar)
    .get(app.api.dispositivo.buscarUm);

  app
    .route('/usuarios')
    .all(authenticated, admin)
    .get(app.api.usuario.listarUsuarios)
    .post(auditoria(CRIAR_USUARIO, app.api.usuario.salvarUsuario));
  app
    .route('/usuarios/:id')
    .all(authenticated, admin)
    .get(app.api.usuario.consultarUsuario)
    .put(auditoria(ATUALIZAR_USUARIO, app.api.usuario.atualizarUsuario));

  app
    .route('/usuario/upload')
    .post(
      multer(multerConfig).single('file'),
      app.api.usuario.uploadFotoUsuario,
    );

  app
    .route('/local')
    .all(authenticated)
    .post(app.api.local.salvar)
    .get(app.api.local.buscarTodos);

  app
    .route('/controle')
    .all(authenticated, admin)
    .post(app.api.controle.salvarRegra)
    .get(app.api.controle.listarRegra);

  app
    .route('/equipamento')
    .all(authenticated)
    .post(app.api.equipamentos.salvarEquipamentos)
    .get(app.api.equipamentos.listarEquipamentos);
  app
    .route('/equipamento/:id')
    .all(authenticated)
    .get(app.api.equipamentos.consultarEquipamentos)
    .delete(app.api.equipamentos.deletarEquipamentos)
    .put(app.api.equipamentos.atualizarEquipamentos);

  app
    .route('/auditoria')
    .all(authenticated, admin)
    .get(app.api.auditoria.buscarTodas);

  app
    .route('/sensor')
    .all(authenticated)
    .post(app.api.sensor.salvar)
    .get(app.api.sensor.buscarTodos);

  app
    .route('/sensor/:id')
    .all(authenticated)
    .get(app.api.sensor.buscarUm)
    .put(app.api.sensor.alterar)
    .delete(app.api.sensor.deletar);

  app
    .route('/atuador')
    .all(authenticated)
    .post(app.api.atuador.salvarAtuador)
    .get(app.api.atuador.listarAtuador);
  app
    .route('/listarDashboard')
    .get(app.api.demanda.listarDashboard);
  app
    .route('/atuador/:id')
    .all(authenticated)
    .get(app.api.atuador.consultarAtuador)
    .put(app.api.atuador.atualizarAtuador);
};
