require('dotenv').config();
import mqtt from 'mqtt';

var url = 'mqtt://' + process.env.HOST_MQTT
var options = {
  port: process.env.PORT_MQTT,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(3, 8),
  username: process.env.USER_MQTT,
  password: process.env.PASSWORD_MQTT,
};

var client = mqtt.connect(url, options);

export default client;
