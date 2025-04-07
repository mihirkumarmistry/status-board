#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>

const char* ssid = "NodeMCU";
const char* password = "Node@1234";

// IMPORTANT: Replace 127.0.0.1 with the IP address of your computer if running Django locally
const char* apiURL = "http://192.168.5.10:8000/securevaultapi/user/ping?email=miguel-garcia-ruiz@algomau.ca";

IPAddress staticIP(192, 168, 5, 100);
IPAddress gateway(192, 168, 5, 1);
IPAddress subnet(255, 255, 255, 0);

String message = "Initial Message";
String name = "Initial Name";
WiFiServer server(80);
LiquidCrystal_PCF8574 lcd(0x27); // Adjust I2C address if needed

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("NodeMCU is ready!");
  Wire.begin(D2, D1);
  lcd.begin(16, 2);
  lcd.setBacklight(255);
  lcd.setCursor(0, 0);
  lcd.print("Welcome");
  lcd.setCursor(0, 1);
  lcd.print("Connecting...");

  WiFi.mode(WIFI_STA);
  WiFi.config(staticIP, gateway, subnet); // Set static IP
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    server.begin();
    Serial.println("Server started");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    lcd.setCursor(0, 0);
    lcd.print("Connected       ");
    lcd.setCursor(0, 1);
    lcd.print("Successfully    ");

    // Call Backend API
    HTTPClient http;
    WiFiClient wifiClient;
    http.begin(wifiClient, apiURL);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println("API Response:");
      Serial.println(payload);
    } else {
      Serial.print("API call failed: ");
      Serial.println(http.errorToString(httpCode));
    }
    http.end();
  } else {
    Serial.println("\nWiFi connection failed.");
    Serial.println(WiFi.status());
    lcd.setCursor(0, 1);
    lcd.print("Conn. Failed    ");
    while (true); // halt
  }

  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  WiFiClient client = server.accept();
  if (!client) return;

  String req = client.readStringUntil('\r');

  if (req.indexOf("/updateMessage?message=") != -1 && req.indexOf("&name=") != -1) {
    int messageStartIndex = req.indexOf("message=") + 8;
    int nameStartIndex = req.indexOf("&name=") + 6;

    String newMessage = req.substring(messageStartIndex, req.indexOf("&name="));
    String newName = req.substring(nameStartIndex);

    newMessage.replace("+", " ");
    newName.replace("+", " ");

    message = newMessage;
    name = newName;

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(name.substring(0, 16));
    Serial.println(name.substring(0, 16));
    lcd.setCursor(0, 1);
    lcd.print(message.substring(0, 16));
    Serial.println(message.substring(0, 16));

    client.print("HTTP/1.1 200 OK\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Access-Control-Allow-Origin: *\r\n");
    client.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
    client.print("Access-Control-Allow-Headers: Content-Type, Authorization\r\n");
    client.print("\r\n");
    client.print("{\"status\": \"success\", \"name\": \"" + name + "\", \"message\": \"" + message + "\"}");
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

  } else if (req.indexOf("OPTIONS") != -1) {
    client.print("HTTP/1.1 200 OK\r\n");
    client.print("Access-Control-Allow-Origin: *\r\n");
    client.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
    client.print("Access-Control-Allow-Headers: Content-Type, Authorization\r\n");
    client.print("Access-Control-Max-Age: 86400\r\n");
    client.print("\r\n");

  } else {
    client.print("HTTP/1.1 400 Bad Request\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Access-Control-Allow-Origin: *\r\n");
    client.print("\r\n");
    client.print("{\"status\": \"error\", \"message\": \"Invalid request\"}");
  }

  client.stop();
}
