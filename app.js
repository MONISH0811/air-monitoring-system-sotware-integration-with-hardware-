#include <WiFi.h>
#include <HTTPClient.h>

#define TOKEN "BBUS-RuYXAFq007K4FOSK8wJIS05bvMd2cE"
#define DEVICE_LABEL "smart_air_pollution"

const char* SSID = "Monish";
const char* PASSWORD = "osinet123";

#define MQ2_PIN 34
#define MQ7_PIN 35
#define MQ135_PIN 32

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, PASSWORD);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
  float mq2_value = analogRead(MQ2_PIN);
  float mq7_value = analogRead(MQ7_PIN);
  float mq135_value = analogRead(MQ135_PIN);

  sendToUbidots("mq-2", mq2_value);
  sendToUbidots("mq-7", mq7_value);
  sendToUbidots("mq-135", mq135_value);

  delay(5000); // Send data every 5 seconds
}

void sendToUbidots(String variable, float value) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "http://industrial.api.ubidots.com/api/v1.6/devices/" + String(DEVICE_LABEL);
    String payload = "{\"" + variable + "\":" + String(value) + "}";

    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Auth-Token", TOKEN);

    int httpResponseCode = http.POST(payload);

    Serial.println("Sending " + variable + ": " + String(value));
    Serial.println("Response code: " + String(httpResponseCode));

    http.end();
  }
}