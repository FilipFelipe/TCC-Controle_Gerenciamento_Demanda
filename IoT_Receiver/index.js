require('dotenv').config();
const mqtt = require('./config/mqtt');
const logger = require('./logs/logger');
const database = require('./src/database')();

mqtt.on('connect', () => {
  console.log('Iniciando servidor do MQTT');
  mqtt.subscribe('/dispositivos/medicoes');
  mqtt.subscribe('/dispositivos/trifasicos/medicoes');
});

mqtt.on('message', (topic, message) => {
  try {
    const messageJSON = JSON.parse(message.toString());
    switch (topic) {
      case '/dispositivos/medicoes':
        return database.salvarMonoEBifasico(messageJSON);
      case '/dispositivos/trifasicos/medicoes':
        return database.salvarTrifasico(messageJSON);
    }
  } catch (erro) {
    logger.error(erro.message);
  }
});
