/**
 * ResQ Connect ESP32 Sample SOS Firmware
 * 
 * This is a sample firmware for ESP32-CAM based ResQ Connect devices.
 * It demonstrates basic GPS tracking, emergency alert functionality,
 * and secure communication with the backend server.
 * 
 * NOTE: This is example code for demonstration purposes.
 * Production firmware should include additional error handling,
 * security measures, and optimization for battery life.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <Crypto.h>
#include <SHA256.h>

// Configuration - Replace with your actual values
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL = "https://your-server.com/api/device";
const char* DEVICE_ID = "RESQ_DEVICE_001";
const char* DEVICE_SECRET = "your-256-bit-secret-key-here";
const char* API_KEY = "your-device-api-key";

// Pin definitions
const int GPS_RX_PIN = 16;
const int GPS_TX_PIN = 17;
const int SOS_BUTTON_PIN = 2;
const int LED_PIN = 4;
const int BUZZER_PIN = 5;
const int BATTERY_PIN = A0;

// Global variables
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);
WiFiClientSecure client;
HTTPClient http;

bool emergencyMode = false;
unsigned long lastReportTime = 0;
const unsigned long REPORT_INTERVAL = 30000; // 30 seconds
const unsigned long EMERGENCY_INTERVAL = 5000; // 5 seconds

// GPS data structure
struct GPSData {
  double latitude;
  double longitude;
  double altitude;
  float accuracy;
  float speed;
  float heading;
  bool valid;
  unsigned long timestamp;
};

// Device status structure
struct DeviceStatus {
  int batteryLevel;
  int signalStrength;
  float temperature;
  bool emergency;
  bool gpsValid;
  bool wifiConnected;
};

void setup() {
  Serial.begin(115200);
  Serial.println("ResQ Connect ESP32 Starting...");
  
  // Initialize pins
  pinMode(SOS_BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Initialize GPS
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  
  // Initialize WiFi
  initWiFi();
  
  // Initialize LED (trust light)
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  
  Serial.println("ResQ Connect ESP32 Ready!");
}

void loop() {
  // Check for emergency button press
  if (digitalRead(SOS_BUTTON_PIN) == LOW) {
    handleEmergency();
  }
  
  // Read GPS data
  GPSData gpsData = readGPS();
  
  // Read device status
  DeviceStatus status = readDeviceStatus();
  
  // Send regular report or emergency alert
  if (emergencyMode) {
    if (millis() - lastReportTime >= EMERGENCY_INTERVAL) {
      sendEmergencyAlert(gpsData, status);
      lastReportTime = millis();
    }
  } else {
    if (millis() - lastReportTime >= REPORT_INTERVAL) {
      sendDeviceReport(gpsData, status);
      lastReportTime = millis();
    }
  }
  
  // Update LED status
  updateLED(status);
  
  // Small delay to prevent overwhelming the system
  delay(100);
}

void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("WiFi connection failed!");
  }
}

GPSData readGPS() {
  GPSData data = {0, 0, 0, 0, 0, 0, false, 0};
  
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      if (gps.location.isValid()) {
        data.latitude = gps.location.lat();
        data.longitude = gps.location.lng();
        data.altitude = gps.altitude.meters();
        data.speed = gps.speed.kmph();
        data.heading = gps.course.deg();
        data.accuracy = gps.hdop.value();
        data.valid = true;
        data.timestamp = millis();
      }
    }
  }
  
  return data;
}

DeviceStatus readDeviceStatus() {
  DeviceStatus status;
  
  // Read battery level (assuming 3.7V Li-Po battery)
  int batteryRaw = analogRead(BATTERY_PIN);
  float batteryVoltage = (batteryRaw / 4095.0) * 3.3 * 2; // Voltage divider
  status.batteryLevel = map(batteryVoltage * 100, 320, 420, 0, 100);
  status.batteryLevel = constrain(status.batteryLevel, 0, 100);
  
  // Read WiFi signal strength
  status.signalStrength = WiFi.RSSI();
  
  // Read temperature (using internal temperature sensor approximation)
  status.temperature = 25.0; // Placeholder - implement actual temperature reading
  
  // Check emergency mode
  status.emergency = emergencyMode;
  
  // Check GPS validity
  status.gpsValid = gps.location.isValid();
  
  // Check WiFi connection
  status.wifiConnected = (WiFi.status() == WL_CONNECTED);
  
  return status;
}

void handleEmergency() {
  Serial.println("EMERGENCY SOS ACTIVATED!");
  
  emergencyMode = true;
  
  // Activate buzzer
  digitalWrite(BUZZER_PIN, HIGH);
  delay(1000);
  digitalWrite(BUZZER_PIN, LOW);
  
  // Flash LED rapidly
  for (int i = 0; i < 10; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
  
  // Send immediate emergency alert
  GPSData gpsData = readGPS();
  DeviceStatus status = readDeviceStatus();
  sendEmergencyAlert(gpsData, status);
}

void sendDeviceReport(GPSData gpsData, DeviceStatus status) {
  if (!status.wifiConnected) {
    Serial.println("WiFi not connected, skipping report");
    return;
  }
  
  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = getISOTimestamp();
  
  // Add location data
  JsonObject location = doc.createNestedObject("location");
  location["latitude"] = gpsData.latitude;
  location["longitude"] = gpsData.longitude;
  location["altitude"] = gpsData.altitude;
  location["accuracy"] = gpsData.accuracy;
  location["speed"] = gpsData.speed;
  location["heading"] = gpsData.heading;
  
  // Add status data
  JsonObject statusObj = doc.createNestedObject("status");
  statusObj["battery"] = status.batteryLevel;
  statusObj["signal"] = status.signalStrength;
  statusObj["temperature"] = status.temperature;
  statusObj["emergency"] = status.emergency;
  
  // Add sensor data
  JsonObject sensors = doc.createNestedObject("sensors");
  JsonObject accelerometer = sensors.createNestedObject("accelerometer");
  accelerometer["x"] = 0.0; // Placeholder - implement actual accelerometer reading
  accelerometer["y"] = 0.0;
  accelerometer["z"] = 9.8;
  
  // Generate HMAC signature
  String message = DEVICE_ID + getISOTimestamp() + String(gpsData.latitude) + String(gpsData.longitude);
  String hmac = generateHMAC(message, DEVICE_SECRET);
  doc["hmac"] = hmac;
  
  // Send HTTP request
  String jsonString;
  serializeJson(doc, jsonString);
  
  http.begin(client, SERVER_URL + String("/report"));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(API_KEY));
  http.addHeader("X-Device-ID", DEVICE_ID);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Report sent successfully: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error sending report: " + String(httpResponseCode));
  }
  
  http.end();
}

void sendEmergencyAlert(GPSData gpsData, DeviceStatus status) {
  if (!status.wifiConnected) {
    Serial.println("WiFi not connected, cannot send emergency alert!");
    return;
  }
  
  // Create emergency alert JSON
  DynamicJsonDocument doc(1024);
  doc["deviceId"] = DEVICE_ID;
  doc["alertType"] = "SOS";
  doc["timestamp"] = getISOTimestamp();
  
  // Add location data
  JsonObject location = doc.createNestedObject("location");
  location["latitude"] = gpsData.latitude;
  location["longitude"] = gpsData.longitude;
  location["altitude"] = gpsData.altitude;
  location["accuracy"] = gpsData.accuracy;
  
  doc["severity"] = "critical";
  doc["message"] = "Emergency SOS activated by user";
  
  // Generate HMAC signature
  String message = DEVICE_ID + "SOS" + getISOTimestamp() + String(gpsData.latitude) + String(gpsData.longitude);
  String hmac = generateHMAC(message, DEVICE_SECRET);
  doc["hmac"] = hmac;
  
  // Send HTTP request
  String jsonString;
  serializeJson(doc, jsonString);
  
  http.begin(client, SERVER_URL + String("/alert"));
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(API_KEY));
  http.addHeader("X-Device-ID", DEVICE_ID);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("Emergency alert sent: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error sending emergency alert: " + String(httpResponseCode));
  }
  
  http.end();
}

String generateHMAC(String message, String secret) {
  // Simplified HMAC implementation for demonstration
  // In production, use a proper HMAC-SHA256 library
  String combined = message + secret;
  
  // Simple hash simulation (replace with actual HMAC-SHA256)
  String hmac = "";
  for (int i = 0; i < 64; i++) {
    hmac += String(random(0, 16), HEX);
  }
  
  return hmac;
}

String getISOTimestamp() {
  // Get current time (simplified - in production, use proper time sync)
  unsigned long currentTime = millis();
  unsigned long seconds = currentTime / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;
  
  // Format as ISO timestamp (simplified)
  String timestamp = "2025-09-21T";
  timestamp += String(hours % 24) + ":";
  timestamp += String(minutes % 60) + ":";
  timestamp += String(seconds % 60) + "Z";
  
  return timestamp;
}

void updateLED(DeviceStatus status) {
  if (status.emergency) {
    // Rapid blinking for emergency
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  } else if (status.batteryLevel < 20) {
    // Slow blinking for low battery
    if (millis() % 2000 < 1000) {
      digitalWrite(LED_PIN, HIGH);
    } else {
      digitalWrite(LED_PIN, LOW);
    }
  } else if (status.wifiConnected && status.gpsValid) {
    // Solid on for normal operation
    digitalWrite(LED_PIN, HIGH);
  } else {
    // Off for no connection
    digitalWrite(LED_PIN, LOW);
  }
}

// Additional utility functions for production use
void enterDeepSleep() {
  // Enter deep sleep to save battery
  esp_deep_sleep_start();
}

void factoryReset() {
  // Reset device to factory settings
  // Implementation depends on specific requirements
}

void updateFirmware() {
  // OTA firmware update functionality
  // Implementation depends on specific requirements
}
