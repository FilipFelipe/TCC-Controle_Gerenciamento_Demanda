#include <PubSubClient.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <HTTPUpdate.h>
#include "EmonLib.h"

int fimSetup;

void setup() {

  Serial.begin(115200);
  Serial.println(WiFi.macAddress());
  configurarSensores();
  conectarWifi();
  conectarMQTT();
  pinMode(21, OUTPUT);
  pinMode(33, INPUT);
  pinMode(34, INPUT);
}

void loop() {

  leitura();
  checaConexaoWiFi();
  checaConexaoMQTT();

}
