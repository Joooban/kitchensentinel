# 🔥 Kitchen Sentinel: Smart Stove & Gas Leak Alert System

**Kitchen Sentinel** is a mobile companion app designed for real-time kitchen hazard detection, built with React Native and powered by Firebase. It assists elderly users and caregivers by delivering immediate alerts for critical hazards like gas leaks, flames, and lack of motion during dangerous events.

---

## 📱 Mobile App Features (React Native)

### 🔔 Real-Time Alerts
- Listens for live sensor data changes from Firebase.
- Sends critical **push notifications** when danger is detected (e.g., Gas Leak, Flame Presence, or No Motion).
- Alerts remain persistent until resolved via physical button on-site.

### 👨‍👩‍👧 Caregiver & Emergency Settings
- Users can **set and edit** emergency contact numbers.
- Displays caregiver/emergency info for use during a hazard.
- Can be extended to auto-dial or share location during alert scenarios.

### 🧓 Accessibility-Oriented UI
- Dark mode toggle 🌙
- Adjustable font sizes for easier readability 🔠
- Designed with elderly and low-vision users in mind.

### 🎨 Clean and Customizable Interface
- Dynamic UI themes, status indicators for gas, flame, and motion.
- Friendly onboarding for elderly users.
- Help Center provides usage tips and contact information.

---

## 🔌 Setup & Installation

### App Setup (Expo)

1. Clone the repository.
2. Run `npm install` or `yarn`.
3. Start the app with `npx expo start`.
4. Use your Firebase Realtime Database URL and adjust `firebase.js` accordingly.

### ESP32 Setup

1. Flash the ESP32 using Arduino IDE.
2. Update Wi-Fi credentials and Firebase config.
3. Upload the sketch.
4. Sensors will auto-report to Firebase every 1 second.

---

## ☁️ Firebase Realtime Database

The app listens to the following Firebase Realtime Database structure:

```json
sensors: {
  latest: {
    gasLeak: true,
    flamePresence: true,
    motionDetected: false,
    lastUpdated: "2025-06-30T07:00:00Z",
    systemReset: false
  }
}
alerts: {
  1688123456789: {
    type: "NO_MOTION_GAS",
    message: "No motion + Gas detected!",
    timestamp: "2025-06-30T07:00:00Z",
    severity: "HIGH",
    resolved: false
  }
}
```

The app subscribes to changes and notifies users if new high-severity alerts are pushed.

---

## ⚙️ IoT Hardware (ESP32 + Sensors)

While the app handles user interaction, the **ESP32 microcontroller** is the heart of the detection system.

### 👃 MQ-2 Gas Sensor  
Detects flammable gases like LPG. Triggers persistent alerts when danger is detected.

### 🔥 Flame Sensor (NTC)
Simulates flame detection via temperature threshold. Persistent alert until reset.

### 🕺 PIR Motion Sensor  
Detects motion. If motion is absent during a gas leak or flame presence, a critical alert is sent.

### 📢 LED & Buzzer  
Visual and audible signals are triggered during persistent alerts. Passive buzzer emits beeps.

### 🔘 Reset Button  
Physically resets flame/gas alert states and synchronizes with Firebase (`systemReset = true`).

---

## 🧪 Evaluation Summary

- ✅ Usability tested with elderly and caregiver participants.
- ✅ Heuristic evaluation performed (e.g., visibility, flexibility, error recovery).
- ✅ Positive feedback on accessibility and peace-of-mind features.

---

## 🛠️ Future Enhancements

- Voice assistant integration for accessibility.
- SMS auto-send to emergency contacts.
- Offline mode fallback or local alerts.

---

## 👩‍💻 Authors

**Developed by BSCS Students**
- **<span style="color:#FF6347">Marga Pilapil</span>** - [vennDiagramm](https://github.com/vennDiagramm)
- **<span style="color:#4682B4">Jhouvann Morden</span>** - [Joooban](https://github.com/Joooban) 
- **<span style="color:#8A2BE2">Mel Macabenta</span>** - [Lumeru](https://github.com/MeruMeru09)

Special thanks to our professors and pilot testers!

---

## 📸 Screenshots
![App_Screenshot](https://github.com/user-attachments/assets/289974d5-106a-473f-85eb-39b7c63606a0)

---

