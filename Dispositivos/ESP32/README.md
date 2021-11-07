# ESP32 

### Configuração de rede
Editar o arquivo Wifi.ino
```c
const char* ssid = "wifi";                          // Rede WIFI
const char* password =  "wifiPW";                   // Senha da rede WIFI
```
### Configuração do MQTT
Editar o arquivo MQTT.ino
```c
#define ID_DEVICE "Esp_AB21AS"                      // Nome do Dispositivo (deve ser um nome único)
const char *USUARIO = "user";                       // Usuário do MQTT
const char *SENHA = "userPW";                       // Senha do MQTT
const char *BROKER_MQTT = "127.0.0.1";              // IP do broker MQTT
int BROKER_PORT = 5903;                             // Porta do Broker MQTT
```
### Bibliotecas Necessárias
| Biblioteca  | Link |
| ------------- | ------------- |
| EmonLib  | [GitHub](https://github.com/openenergymonitor/EmonLib)  |
| PubSubClient  | [GitHub](https://github.com/knolleary/pubsubclient)  |