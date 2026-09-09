# 🌱 Pasumai ESP32 Soil Moisture Sensor Node

Complete hardware-to-cloud setup guide for streaming live soil moisture telemetry from an ESP32 into Supabase and displaying it in real-time on the Pasumai Dashboard.

---

## 🔌 Hardware Wiring Diagram

| Sensor Pin (Capacitive v1.2) | ESP32 Pin (ESP-WROOM-32) | Notes |
| :--- | :--- | :--- |
| **VCC** | **3.3V** | Use 3.3V power pin |
| **GND** | **GND** | Common ground |
| **AOUT** | **GPIO 34** | ADC1 Channel 6 (Input-only analog pin) |

---

## 📦 Required Arduino IDE Setup

1. **Install ESP32 Board Package**:
   - Go to `Tools` → `Board` → `Boards Manager...`
   - Search for **`esp32` by Espressif Systems** and install version `2.x.x` or `3.x.x`.
2. **Install ArduinoJson Library**:
   - Go to `Tools` → `Manage Libraries...`
   - Search for **`ArduinoJson` by Benoît Blanchon** and install version `6.x` or `7.x`.
3. **Select Board**:
   - `Tools` → `Board` → `esp32` → **`ESP32 Dev Module`**.
4. **Port**:
   - Select the USB serial COM port for your ESP32 (`/dev/cu.usbserial...` on Mac or `COMx` on Windows).
5. **Upload Speed**: `115200` or `921600`.

---

## ⚙️ Calibration Guide (2 Minutes)

Capacitive soil moisture sensors output **high ADC values in dry air** and **lower ADC values in water**.

1. **Step 1 (Dry Air Calibration)**:
   - Hold the sensor in dry air (do not touch the metal traces with fingers).
   - Open Arduino IDE **Serial Monitor** (Baud rate `115200`).
   - Note the raw ADC reading (e.g. `2800` to `3200`).
   - Set this as `DRY_VALUE` in the code:
     ```cpp
     const int DRY_VALUE = 2800; // 0%
     ```

2. **Step 2 (Wet / Submerged Calibration)**:
   - Submerge the sensor up to the white line in a cup of water.
   - Note the raw ADC reading in the Serial Monitor (e.g. `1200` to `1500`).
   - Set this as `WET_VALUE` in the code:
     ```cpp
     const int WET_VALUE = 1300; // 100%
     ```

---

## 🔒 Supabase RLS Permission Notice

Ensure your Supabase table allows public `INSERT` so the ESP32 can write without authentication blockers:

```sql
-- Run in Supabase SQL Editor:
alter table sensor_telemetry disable row level security;
```

---

## 🚀 Live Demo Verification

1. Sensor in Air → Serial monitor shows `Raw: ~2800 | 0%` → Pasumai shows **0% / Low Moisture**.
2. Sensor in Wet Soil / Water → Serial monitor shows `Raw: ~1350 | ~95%` → Pasumai automatically animates to **95% LIVE** with 0-second latency.
