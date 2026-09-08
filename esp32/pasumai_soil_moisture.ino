/*
  =============================================================================
  🌱 PASUMAI SMART AGRI - ESP32 SOIL MOISTURE TELEMETRY FIRMWARE
  =============================================================================
  Hardware:
    - ESP32 Dev Module (ESP-WROOM-32)
    - Capacitive Soil Moisture Sensor v1.2
  
  Wiring:
    - Sensor VCC  --> ESP32 3.3V
    - Sensor GND  --> ESP32 GND
    - Sensor AOUT --> ESP32 GPIO 34 (ADC1 Channel 6)
  
  Target:
    - Supabase REST API (POST to sensor_telemetry table)
  =============================================================================
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ============================================================================
// 1. PRE-CONFIGURED NETWORK CREDENTIALS
// ============================================================================
const char* WIFI_SSID     = "Surya";
const char* WIFI_PASSWORD = "Suri7860$$$";

// Supabase REST Endpoint & Publishable Key
const char* SUPABASE_URL  = "https://irxsothgamllsoeqllef.supabase.co/rest/v1/sensor_telemetry";
const char* SUPABASE_KEY  = "sb_publishable_pVKAyyXXMelzZJKl2gvGcg_16JMKxH6";

// ============================================================================
// 2. HARDWARE & CALIBRATION CONSTANTS
// ============================================================================
#define SOIL_PIN        34   // Sensor AOUT connected to GPIO 34
#define STATUS_LED      2    // ESP32 built-in status LED

// Calibrated Values:
// - Air / Dry Value: ~2600 (0% Moisture)
// - Submerged in Water: ~900 (100% Moisture)
const int DRY_VALUE     = 2600;  // 0% Moisture (Air reading)
const int WET_VALUE     = 900;   // 100% Moisture (Water reading)

// Telemetry interval (30 seconds)
const unsigned long SEND_INTERVAL_MS = 30000;
unsigned long lastSendTime = 0;

// ============================================================================
// 3. HELPER FUNCTIONS
// ============================================================================

/**
 * Connect or Reconnect to WiFi
 */
void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println();
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("[WiFi] Connected successfully!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("[WiFi] Failed to connect. Will retry during next loop.");
  }
}

/**
 * Read smoothed Analog value from Soil Moisture Sensor
 * Takes 10 samples and averages them to filter out analog noise
 */
int readSmoothADC(int pin) {
  long sum = 0;
  const int samples = 10;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
    delay(10);
  }
  return sum / samples;
}

/**
 * Convert Raw ADC Value (0-4095) to Soil Moisture Percentage (0-100%)
 * Capacitive sensors output higher voltage/ADC when dry and lower when wet.
 */
int calculateMoisturePercent(int rawAdc) {
  int percent = map(rawAdc, DRY_VALUE, WET_VALUE, 0, 100);
  return constrain(percent, 0, 100);
}

/**
 * Send Telemetry payload to Supabase REST API
 */
bool sendTelemetryToSupabase(int rawValue, int percentValue) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] WiFi not connected. Skipping upload.");
    connectToWiFi();
    return false;
  }

  // Flash status LED during transmission
  digitalWrite(STATUS_LED, HIGH);

  WiFiClientSecure client;
  client.setInsecure(); // Direct TLS connection without cert verification

  HTTPClient http;
  http.begin(client, SUPABASE_URL);

  // Set Supabase Headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", SUPABASE_KEY);
  http.addHeader("Authorization", String("Bearer ") + SUPABASE_KEY);
  http.addHeader("Prefer", "return=minimal");

  // Create JSON Payload
  StaticJsonDocument<128> doc;
  doc["moisture_raw"] = rawValue;
  doc["moisture_percent"] = percentValue;

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.println("[HTTP] Sending POST payload to Supabase:");
  Serial.print("       --> ");
  Serial.println(requestBody);

  int httpResponseCode = http.POST(requestBody);

  bool success = false;
  if (httpResponseCode >= 200 && httpResponseCode < 300) {
    Serial.print("[HTTP] Success! Supabase Status: ");
    Serial.println(httpResponseCode);
    success = true;
  } else {
    Serial.print("[HTTP] Failed! Supabase Status: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    if (response.length() > 0) {
      Serial.print("[HTTP] Response: ");
      Serial.println(response);
    }
  }

  http.end();
  digitalWrite(STATUS_LED, LOW);
  return success;
}

// ============================================================================
// 4. SETUP & LOOP
// ============================================================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("==================================================");
  Serial.println("🌱 PASUMAI ESP32 SOIL MOISTURE SENSOR NODE STARTING");
  Serial.println("==================================================");

  pinMode(SOIL_PIN, INPUT);
  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(STATUS_LED, LOW);

  // Configure ESP32 ADC (12-bit: 0 - 4095)
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db); // Full 0 - 3.3V range

  // Initial WiFi Connection
  connectToWiFi();
}

void loop() {
  unsigned long currentMillis = millis();

  // Read and send telemetry every 30 seconds
  if (currentMillis - lastSendTime >= SEND_INTERVAL_MS || lastSendTime == 0) {
    lastSendTime = currentMillis;

    // 1. Read Soil Moisture Sensor
    int rawADC = readSmoothADC(SOIL_PIN);
    int moisturePercent = calculateMoisturePercent(rawADC);

    // 2. Print Calibration & Diagnostic Info to Serial Monitor
    Serial.println("--------------------------------------------------");
    Serial.printf("[SENSOR] Raw ADC: %d | Moisture: %d%%\n", rawADC, moisturePercent);
    if (moisturePercent >= 60) {
      Serial.println("[STATUS] Optimal Soil Moisture 🌿");
    } else if (moisturePercent >= 40) {
      Serial.println("[STATUS] Adequate Soil Moisture 💧");
    } else {
      Serial.println("[STATUS] Low Moisture - Needs Irrigation ⚠️");
    }

    // 3. Post data to Supabase
    sendTelemetryToSupabase(rawADC, moisturePercent);
    Serial.println("--------------------------------------------------");
  }

  // Small delay for watchdog
  delay(100);
}
