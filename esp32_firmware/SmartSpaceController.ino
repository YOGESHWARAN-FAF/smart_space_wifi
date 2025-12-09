#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h> // Make sure to install ArduinoJson library

// ==========================================
// CONFIGURATION
// ==========================================
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const int PORT = 80;

// Device Mapping: Name -> GPIO Pin
// Add your devices here
struct DeviceMapping {
  String name;
  int pin;
  bool isPWM; // true for Regulatable (Slider), false for Normal (Switch)
};

// Example Configuration - CHANGE THESE PINS TO MATCH YOUR SETUP
DeviceMapping devices[] = {
  { "light", 2, false },      // Built-in LED on many ESP32s (GPIO 2)
  { "fan", 4, true },         // Example PWM device on GPIO 4
  { "bedroom_light", 5, false }
};

const int deviceCount = sizeof(devices) / sizeof(devices[0]);

// ==========================================
// SERVER SETUP
// ==========================================
WebServer server(PORT);

void setup() {
  Serial.begin(115200);
  
  // Initialize Pins
  for (int i = 0; i < deviceCount; i++) {
    pinMode(devices[i].pin, OUTPUT);
    // Initialize to OFF
    if (devices[i].isPWM) {
      ledcSetup(i, 5000, 8); // Channel i, 5kHz, 8-bit
      ledcAttachPin(devices[i].pin, i);
      ledcWrite(i, 0);
    } else {
      digitalWrite(devices[i].pin, LOW);
    }
  }

  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("\nConnecting to WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup Routes
  server.on("/ping", HTTP_GET, handlePing);
  server.on("/device", HTTP_GET, handleDevice);
  server.onNotFound(handleNotFound);

  // Start Server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

// ==========================================
// HANDLERS
// ==========================================

void addCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handlePing() {
  addCorsHeaders();
  server.send(200, "text/plain", "pong");
}

void handleDevice() {
  addCorsHeaders();

  if (!server.hasArg("name")) {
    server.send(400, "text/plain", "Missing 'name' parameter");
    return;
  }

  String deviceName = server.arg("name");
  int deviceIndex = -1;

  // Find device by name
  for (int i = 0; i < deviceCount; i++) {
    if (devices[i].name.equalsIgnoreCase(deviceName)) {
      deviceIndex = i;
      break;
    }
  }

  if (deviceIndex == -1) {
    server.send(404, "text/plain", "Device not found");
    return;
  }

  // Handle 'state' (ON/OFF)
  if (server.hasArg("state")) {
    String state = server.arg("state");
    if (state.equalsIgnoreCase("on")) {
      if (devices[deviceIndex].isPWM) {
         ledcWrite(deviceIndex, 255); // Full brightness
      } else {
         digitalWrite(devices[deviceIndex].pin, HIGH);
      }
    } else if (state.equalsIgnoreCase("off")) {
      if (devices[deviceIndex].isPWM) {
         ledcWrite(deviceIndex, 0);
      } else {
         digitalWrite(devices[deviceIndex].pin, LOW);
      }
    } else {
      server.send(400, "text/plain", "Invalid state. Use 'on' or 'off'");
      return;
    }
  }
  // Handle 'value' (0-100)
  else if (server.hasArg("value")) {
    int val = server.arg("value").toInt();
    if (val < 0) val = 0;
    if (val > 100) val = 100;

    if (devices[deviceIndex].isPWM) {
      // Map 0-100 to 0-255
      int pwmValue = map(val, 0, 100, 0, 255);
      ledcWrite(deviceIndex, pwmValue);
    } else {
      // For non-PWM, >0 is ON
      digitalWrite(devices[deviceIndex].pin, val > 0 ? HIGH : LOW);
    }
  } else {
    server.send(400, "text/plain", "Missing 'state' or 'value' parameter");
    return;
  }

  // Response
  StaticJsonDocument<200> doc;
  doc["status"] = "success";
  doc["device"] = deviceName;
  doc["pin"] = devices[deviceIndex].pin;
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

void handleNotFound() {
  if (server.method() == HTTP_OPTIONS) {
    addCorsHeaders();
    server.send(204);
  } else {
    addCorsHeaders();
    server.send(404, "text/plain", "Not found");
  }
}
