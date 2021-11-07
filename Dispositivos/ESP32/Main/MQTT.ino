#define ID_DEVICE "Esp_XXX_rec" //Nome do Dispositivo (deve ser um nome único)

const char *USUARIO = "";                  // Usuário do MQTT
const char *SENHA = "";                  // Senha do MQTT
const char *BROKER_MQTT = ""; // URL do broker MQTT
int BROKER_PORT = 5903;                          // Porta do Broker MQTT

String id = "-1";                                // Id do dispositivo
String versaoFW = "1.12";                        // Id do dispositivo

WiFiClient espClient;         // Cria o objeto espClient
PubSubClient MQTT(espClient); // Instancia o Cliente MQTT passando o objeto espClie

void conectarMQTT()
{

  MQTT.setServer(BROKER_MQTT, BROKER_PORT);
  MQTT.setCallback(resposta_mqtt);
  while (!MQTT.connected())
  {
    if (MQTT.connect(ID_DEVICE, USUARIO, SENHA))
    {
      Serial.println("Conectado com sucesso ao broker MQTT!");
      String topicoCallback = "/dispositivos/" + WiFi.macAddress();
      Serial.println(topicoCallback);
      MQTT.subscribe(topicoCallback.c_str());
    }
    else
    {
      Serial.println("Falha ao reconectar no broker.");
      Serial.println("Havera nova tentativa de conexao em 2s");
      delay(2000);
    }
  }
}

void resposta_mqtt(char *topic, byte *payload, unsigned int length)
{
  String msg;
  for (int i = 0; i < length; i++)
  {
    char c = (char)payload[i];
    msg += c;
  }
    Serial.println(msg);
  switch (msg[0]) {
    case 'a':{
      atualizar(msg.substring(1));
      break;}
    case 'o':{
      atuar(msg.substring(1,3).toInt(), msg.substring(3));
      break;}
    case 't':{
     Serial.println(topic);
      break;}
    case 'c':{
      String topicoCallback = "dispositivos/teste";
      MQTT.subscribe(topicoCallback.c_str());
      Serial.println("trocando topico");
      break;}
    case 'v':{
      Serial.println("Versão do FW:" + versaoFW);
      String VersaoTopico = "dispositivos/"+WiFi.macAddress()+"/versao";
      MQTT.publish(VersaoTopico.c_str(), versaoFW.c_str());
      break;}
    case 'i':{
      int id_received = msg.substring(1).toInt();
      if(id_received != 0) {
        id = id_received;
        Serial.println(id);
      }
      break;}
  }
}

void enviarMQTT(const char *topico, String mensagem)
{
  char cMensagem[100];
  mensagem.toCharArray(cMensagem, 100);
  Serial.println("Enviando dados");
  MQTT.publish(topico, cMensagem);
}

void checaConexaoMQTT()
{
  if (!MQTT.connected())
    conectarMQTT();
  MQTT.loop();
}
