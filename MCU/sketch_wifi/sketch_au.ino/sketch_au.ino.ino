#include <ESP8266WiFi.h>
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>

const char* ssid = "AU-PUBLIC";
const char* password = "";

IPAddress staticIP(10, 8, 4, 100);
IPAddress gateway(10, 8, 4, 1);
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
    lcd.print("Connected");
    lcd.setCursor(0, 1);
    lcd.print("Successfully");
  } else {
    Serial.println("\nWiFi connection failed.");
    Serial.println(WiFi.status());
    lcd.setCursor(0, 1);
    lcd.print("Conn. Failed");
    while (true);
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
    lcd.print(name.substring(0, 16)); // Display name on the first line
    Serial.println(name.substring(0, 16)); // Display name on the first line
    lcd.setCursor(0, 1);
    lcd.print(message.substring(0, 16)); // Display message on the second line
    Serial.println(message.substring(0, 16)); // Display message on the second line

    client.print("HTTP/1.1 200 OK\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Access-Control-Allow-Origin: *\r\n"); // Allow all origins
    client.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"); // Allow GET, POST, OPTIONS
    client.print("Access-Control-Allow-Headers: Content-Type, Authorization\r\n"); // Allow Content-Type, Authorization
    client.print("\r\n");
    client.print("{\"status\": \"success\", \"name\": \"" + name + "\", \"message\": \"" + message + "\"}");
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

  } else if (req.indexOf("OPTIONS") != -1){
      client.print("HTTP/1.1 200 OK\r\n");
      client.print("Access-Control-Allow-Origin: *\r\n");
      client.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
      client.print("Access-Control-Allow-Headers: Content-Type, Authorization\r\n");
      client.print("Access-Control-Max-Age: 86400\r\n");
      client.print("\r\n");
  }

  else {
    client.print("HTTP/1.1 400 Bad Request\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Access-Control-Allow-Origin: *\r\n");
    client.print("\r\n");
    client.print("{\"status\": \"error\", \"message\": \"Invalid request\"}");
  }

  client.stop();
}