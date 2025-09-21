# ResQ Connect Hardware Documentation

## Overview

ResQ Connect hardware consists of wearable safety devices designed for travelers in North-Eastern India. The devices provide GPS tracking, emergency alerts, and secure communication with the mobile app.

## Recommended Starter Kit

### ESP32-Based Solution (Recommended)
- **Main Board**: ESP32-CAM or ESP32-S3 with camera module
- **GPS Module**: NEO-6M or NEO-8M GPS receiver
- **Communication**: 
  - Primary: WiFi (ESP32 built-in)
  - Secondary: SIM800L GSM module or LoRa module
- **Power**: 3.7V Li-Po battery (1000-2000mAh)
- **Additional Components**:
  - LED indicators (trust light, status)
  - Buzzer for SOS alerts
  - Haptic motor for vibrations
  - Power management circuit
  - Enclosure (waterproof, rugged)

### Alternative: Raspberry Pi Pico W
- **Main Board**: Raspberry Pi Pico W
- **GPS Module**: NEO-6M GPS receiver
- **Communication**: WiFi + optional cellular module
- **Power**: 3.7V Li-Po battery with power management
- **Additional Components**: Similar to ESP32 setup

## Hardware Specifications

### ESP32-CAM Configuration
- **CPU**: Dual-core 32-bit LX6 microprocessor
- **WiFi**: 802.11 b/g/n
- **Bluetooth**: BLE 4.2
- **Camera**: OV2640 (2MP) with night vision capability
- **Storage**: 4MB Flash, 520KB SRAM
- **GPIO**: 30+ pins available
- **Power**: 3.3V operation, 5V input

### GPS Requirements
- **Accuracy**: <3 meters (outdoor)
- **Update Rate**: 1Hz minimum
- **Sensitivity**: -165dBm tracking
- **Time to First Fix**: <30 seconds (cold start)
- **Backup**: RTC for timekeeping when GPS unavailable

## Data Format

### Device Report Format
```json
{
  "deviceId": "RESQ_DEVICE_001",
  "timestamp": "2025-09-21T17:30:00Z",
  "location": {
    "latitude": 26.1445,
    "longitude": 91.7362,
    "altitude": 55.2,
    "accuracy": 2.5,
    "speed": 0.0,
    "heading": 180.5
  },
  "status": {
    "battery": 85,
    "signal": -65,
    "temperature": 28.5,
    "emergency": false
  },
  "sensors": {
    "accelerometer": {
      "x": 0.1,
      "y": -0.2,
      "z": 9.8
    },
    "gyroscope": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    }
  },
  "hmac": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

### Emergency Alert Format
```json
{
  "deviceId": "RESQ_DEVICE_001",
  "alertType": "SOS",
  "timestamp": "2025-09-21T17:30:00Z",
  "location": {
    "latitude": 26.1445,
    "longitude": 91.7362,
    "altitude": 55.2,
    "accuracy": 2.5
  },
  "severity": "critical",
  "message": "Emergency SOS activated by user",
  "hmac": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

## HMAC-Based Message Signing

### Security Implementation
- **Algorithm**: HMAC-SHA256
- **Secret Key**: 256-bit shared secret (stored securely on device)
- **Message Format**: `deviceId + timestamp + location + status + secretKey`
- **Verification**: Server validates HMAC before processing any device data

### Example HMAC Generation (Arduino)
```cpp
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Crypto.h>

String generateHMAC(String message, String secretKey) {
  uint8_t hmacResult[32];
  SHA256HMAC hmac((uint8_t*)secretKey.c_str(), secretKey.length());
  hmac.doUpdate((uint8_t*)message.c_str(), message.length());
  hmac.doFinal(hmacResult);
  
  String hmacString = "";
  for (int i = 0; i < 32; i++) {
    hmacString += String(hmacResult[i], HEX);
  }
  return hmacString;
}
```

## Server Endpoint Format

### Device Report Endpoint
- **URL**: `POST /api/device/report`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <device_token>`
  - `X-Device-ID: <device_id>`
- **Body**: Device report JSON (as shown above)
- **Response**: 
  ```json
  {
    "success": true,
    "messageId": "msg_123456789",
    "timestamp": "2025-09-21T17:30:01Z"
  }
  ```

### Emergency Alert Endpoint
- **URL**: `POST /api/device/alert`
- **Headers**: Same as device report
- **Body**: Emergency alert JSON (as shown above)
- **Response**:
  ```json
  {
    "success": true,
    "alertId": "alert_123456789",
    "timestamp": "2025-09-21T17:30:01Z",
    "acknowledged": true
  }
  ```

## Power Management

### Battery Optimization
- **Sleep Mode**: Deep sleep between reports (30-60 seconds)
- **GPS Power**: Turn off GPS when stationary for >5 minutes
- **WiFi Power**: Disconnect when not transmitting
- **Camera Power**: Only activate during emergency or manual trigger

### Power Consumption Estimates
- **Idle Mode**: ~10mA (GPS off, WiFi off)
- **GPS Tracking**: ~50mA (GPS on, WiFi off)
- **Data Transmission**: ~150mA (WiFi on, GPS on)
- **Emergency Mode**: ~200mA (all systems active)

## Development and Testing

### Hardware Emulation
- Use ESP32 simulator for development
- Mock GPS data for indoor testing
- Simulate network conditions and failures
- Test power management scenarios

### Firmware Development
- Use Arduino IDE or PlatformIO
- Implement OTA updates for field deployment
- Add comprehensive logging and diagnostics
- Include factory reset and recovery modes

### Testing Checklist
- [ ] GPS accuracy and time-to-fix
- [ ] WiFi connectivity in various conditions
- [ ] Battery life under different usage patterns
- [ ] Emergency button responsiveness
- [ ] Data transmission reliability
- [ ] HMAC signature validation
- [ ] OTA update functionality
- [ ] Water resistance and durability

## Safety Considerations

### Physical Safety
- Waterproof enclosure (IP67 rating)
- Shock-resistant design for outdoor use
- Non-slip mounting options
- Emergency button easily accessible

### Data Security
- Encrypted communication channels
- Secure device authentication
- Regular security updates
- Privacy protection for location data

### Emergency Features
- One-touch SOS activation
- Automatic emergency mode
- Backup communication methods
- Long battery life for emergencies

## Cost Estimates

### ESP32-Based Kit
- ESP32-CAM: $15-25
- GPS Module: $10-15
- Battery & Charger: $10-20
- Enclosure & Components: $15-25
- **Total**: $50-85 per device

### Raspberry Pi Pico W Kit
- Pico W: $6-10
- GPS Module: $10-15
- Additional Components: $20-30
- **Total**: $36-55 per device

## Future Enhancements

### Advanced Features
- LoRa communication for remote areas
- Solar charging capability
- Advanced sensors (air quality, weather)
- Voice recording and playback
- Integration with local emergency services

### Scalability
- Modular design for easy upgrades
- Standardized communication protocols
- Cloud-based device management
- Fleet monitoring and analytics
