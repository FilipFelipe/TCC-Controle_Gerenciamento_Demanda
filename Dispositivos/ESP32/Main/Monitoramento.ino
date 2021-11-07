// Obriga a utilização de 10 bits pela biblioteca EmonLib
#define ADC_BITS    10
#define ADC_COUNTS  (1<<ADC_BITS)

EnergyMonitor emon1;


void configurarSensores() {

  emon1.voltage(34, 133, 1.7);
  emon1.current(33, 30);
  delay(1000);

}

void leitura() {
  emon1.calcVI(20, 2000);
  enviarDadosMQTT(emon1.Vrms, emon1.Irms, 33, 32);

}

void enviarDadosMQTT(float t, float c, int pt, int pc) {

  String mensagem;
  String mac = "\"" + WiFi.macAddress() + "\"";
  mensagem = "{\"mac\": " + mac + ",\"c\": " + (String) c + ",\"pc\":" + (String) pc + 
  ",\"t\": " + (String) t + ",\"pt\":" + (String) pt + "}";
  enviarMQTT("/dispositivos/medicoes", mensagem);
}

void enviarDadosMQTT(float c, int pc) {

  String mensagem;
  String mac = "\"" + WiFi.macAddress() + "\"";
  mensagem = "{\"mac\": " + mac +",\"c\": " + (String) c + ",\"pc\":" + (String) pc + "}";
  enviarMQTT("/dispositivos/medicoes", mensagem);
}

void enviarDadosMQTT(float c1, float c2, float c3, int pc1, int pc2, int pc3) {

  String mensagem;
  String mac = "\"" + WiFi.macAddress() + "\"";
  mensagem = "{\"mac\": " + mac +",\"c1\": " + (String) c1 + ",\"pc1\":" + (String) pc1 
    + ",\"c2\": " + (String) c2 + ",\"pc2\":" + (String) pc2 +
    + ",\"c3\": " + (String) c3 + ",\"pc3\":" + (String) pc3 +
    "}";
  enviarMQTT("/dispositivos/trifasicos/medicoes", mensagem);
}

void enviarDadosMQTT(float t1, float c1, float t2, float c2, float t3, float c3, int pt1, int pc1, int pt2,int pc2, int pt3,int pc3) {

  String mensagem;
  String mac = "\"" + WiFi.macAddress() + "\"";
  mensagem = "{\"mac\": " + mac +",\"c1\": " + (String) c1 + ", \"t1\": " 
    + (String) t1 + ",\"pt1\":" + (String) pt1 + ",\"pc1\":" + (String) pc1 
    + ",\"c2\": " + (String) c2 + ", \"t2\": " 
    + (String) t2 + ",\"pt2\":" + (String) pt2 + ",\"pc2\":" + (String) pc2 +
    + ",\"c3\": " + (String) c3 + ", \"t3\": " 
    + (String) t3 + ",\"pt3\":" + (String) pt3 + ",\"pc3\":" + (String) pc3 +
    "}";
  enviarMQTT("/dispositivos/trifasicos/medicoes", mensagem);
}
