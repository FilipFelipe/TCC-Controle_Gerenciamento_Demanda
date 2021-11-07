const char* ssid = "wifi-casa";
const char* password =  "123lucas123";

void conectarWifi() {

  Serial.print("Conectando a ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi Conectado");
  Serial.println("Endereço de IP: ");
  Serial.println(WiFi.localIP());
  Serial.println("MAC: ");
  Serial.println(WiFi.macAddress());
}

void checaConexaoWiFi() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Desconectado");
    conectarWifi();
  }


}
