## Expo Go fixes

This project supports running in Expo Go without crashes by:

- Using a cross-platform storage wrapper that selects AsyncStorage on native, `localStorage` on web, with a memory fallback.
- Running in demo mode by default (no API keys or real network calls). Supabase is stubbed with local mock services.
- Adding lightweight RN polyfills for URL and crypto randomness.

How to run:

```
npm install
npx expo start -c
```

If LAN issues occur:

```
npx expo start --tunnel
```

# 🚨 ResQ Connect

the world doesn't need another app. it needs trust. it needs safety. it needs **ResQ Connect**.  

we’ve all seen women compromise freedom for safety—taking longer routes, sharing live locations, clutching phones like lifelines. and yet, when danger strikes, tech usually reacts too late.  

ResQ Connect flips that. it's not just an app. it's a wearable dashcam, an ai safety network, and a donation engine all in one. built for travelers. built to protect. built to empower.  

---

## what it is

a pin-sized device with a camera that works like a human dashcam.  
a mobile app that connects, alerts, and guides.  
an ecosystem that compounds into trust, community, and freedom.  

---

## how it works

the hardware is simple but powerful: esp32-cam with night vision, local storage, secure cloud uploads, a trust light to signal recording, a buzzer for sos, and haptic alerts when things go wrong.  

the mobile app completes the loop: start or stop recording, trigger sos with a tap or a voice, share live location, choose safer routes, and send alerts to trusted contacts.  

when sos goes off, family, friends, and even nearby ResQ Connect users get notified instantly. danger becomes visible. safety becomes collective.  

---

## what makes it different

anyone can add an sos button. anyone can plot maps. anyone can build donation forms.  
but **ResQ Connect stacks what others separate**.  

- human dashcam with esp32-cam + night vision  
- safest route navigation powered by community ratings  
- fake call mode to deter attackers  
- ai noise detection for screams, panic words, “bachao”  
- geo-fencing that alerts when entering unsafe zones  
- purchase-to-donation model: every 10 devices fund 1 for ngos  
- blockchain-backed ngo transparency with geotagged proof of delivery  

it’s not about fighting for the peak in one skill. it’s about owning the intersection. hardware + software + social movement.  

---

## accessibility

safety should never depend on literacy or language.  
so ResQ Connect speaks through vibrations, haptics, and voice.  

- english at launch, hindi in the pipeline  
- voice input like "ResQ Connect, help me" to trigger sos  
- large-icon simplified ui for lower literacy users  
- distinct haptic patterns for sos, low battery, incoming calls  
- visual + audio alerts so nothing goes unnoticed  

---

## security & privacy

safety is useless without privacy. ResQ Connect protects both.  

- end-to-end encrypted cloud storage  
- local + cloud recording for redundancy  
- tamper-proof data transfers  
- full user control: delete whenever you choose  

---

## social impact

this isn’t just tech—it’s a movement.  

every 10 purchases gift 1 device to an ngo.  
donors see geotagged proof of delivery, verified on blockchain.  
ngos share stories and updates back with the community.  
the app tracks your impact: *“your purchase helped donate 0.1 of a device.”*  

safety becomes not just personal but communal.  

---

## hackathon-ready prototype

phase 1 is app-only:  
use the phone camera as a stand-in, sos button, safe route navigation, donation module, ai noise detection simulated.  

phase 2 brings in hardware:  
esp32-cam pin with night vision, trust light, buzzer, haptic alerts, cloud uploads synced with the app.  

---

## the stack

react native with expo.  
typescript for structure.  
tailwind for styling.  
esp32-cam for wearable hardware.  
firebase/aws for cloud.  
maps + payments apis for navigation and donations.  
blockchain layer for ngo transparency.  

---

## how to run

clone the repo.  
install dependencies.  
run it with expo.  

```bash
git clone https://github.com/Darshcmd/ResQConnect.git
cd ResQConnect
npm install
npx expo start
```

---

## 🚀 **Quick Demo (No Setup Required)**

To run the frontend prototype without any API keys or backend services:

```bash
npm run demo
```

This will start the app in demo mode with:
- ✅ Mock authentication (instant login)
- ✅ Sample disaster reports and danger zones
- ✅ AI responses (demo mode)
- ✅ Interactive disaster map
- ✅ All UI features working

**No environment variables needed!**

### 📱 **Viewing the App**

- **Web Browser**: Press `w` after starting
- **Mobile Device**: Install Expo Go app and scan QR code
- **iOS Simulator**: Press `i` (Mac only)
- **Android Emulator**: Press `a`

---

## Prototype Enhancements (demo-only)

The following improvements were added on branch `prototype/disaster-enhanced` and are fully mock-based (no backend or API keys required):

- Inline documentation across Disaster module files
  - `app/(tabs)/disaster-map.tsx`: screen overview, data flow, state purpose
  - `components/WebMap.tsx`: props, marker/popup structure, platform notes
  - `contexts/DisasterContext.tsx`: context shape and mock-service usage
  - `src/services/mock-data-service.ts`: localStorage mock flow
- Filter by disaster type on Disaster Map (in-memory)
- Severity selector in Report Disaster form; shown on map popups and cards
- Last-updated indicator in Disaster Map header (reflects mock refresh time)
- Light spacing/typography polish with responsiveness preserved

Run the demo:

```bash
npm run demo
```

Notes:
- These features are for prototype/demo purposes only
- All data is mocked and stored in `localStorage`; no network calls are made

