void atualizar(String url)
{
  WiFiClient client;
  t_httpUpdate_return ret = httpUpdate.update(client, url, "1.0");
}

void atuar(int porta, String acao)
{
  if(acao == "LIGAR") {
    digitalWrite(porta, HIGH);
  }
  if(acao == "DESLIGAR") {
    digitalWrite(porta, LOW);
  }
}
