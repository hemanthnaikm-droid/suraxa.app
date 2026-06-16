# 🛡️ Suraksha — Women Safety App (React Native / Expo)

A full-featured women's safety mobile app built with **Expo**, **Firebase**, and **Claude AI**.

## Features
- 🆘 SOS Alert with 5-second countdown + vibration
- 📍 Real GPS location sharing (Expo Location API)
- 🤖 Claude AI safety assistant (Anthropic)
- 👥 Emergency contacts (Firebase Firestore synced)
- 📞 One-tap helplines (Police 100, Ambulance 108, Emergency 112, Women's 1091)
- 🎙️ Voice recorder for audio evidence (Expo AV)
- 🗺️ Safe Route finder with AI safety scoring
- 👥 Community safety alerts map

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
Open `src/utils/ai.js` and replace:
```js
const ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE';
```
Get your key at: https://console.anthropic.com

### 3. Run on your phone (Expo Go)
```bash
npx expo start
```
Scan the QR code with the **Expo Go** app.

### 4. Build APK with EAS
```bash
npm install -g eas-cli
eas login
eas init
eas build -p android --profile preview
```

## Project Structure
```
suraksha-app/
├── App.js                          ← Root entry point
├── app.json                        ← Expo config + permissions
├── eas.json                        ← EAS Build config
├── src/
│   ├── utils/
│   │   ├── firebase.js             ← Firebase Auth + Firestore
│   │   ├── ai.js                   ← Claude AI integration
│   │   └── theme.js                ← Colors, constants, seed data
│   ├── components/
│   │   └── UI.js                   ← Shared components (Button, Toast, etc.)
│   ├── screens/
│   │   ├── AuthScreens.js          ← Landing page + Login/Signup modal
│   │   └── DashboardScreen.js      ← Main dashboard with all features
│   └── modules/
│       ├── SOSModule.js            ← SOS alert with countdown
│       ├── LocationModule.js       ← GPS location sharing
│       ├── AIModule.js             ← Claude AI chat
│       ├── VoiceModule.js          ← Audio recorder
│       ├── ContactsModule.js       ← Emergency contacts (Firebase)
│       └── OtherModules.js         ← Helplines, Safe Route, Community
```

## Firebase Rules
Use the included `firestore_rules.txt` in your Firebase Console → Firestore → Rules.

## Built With
- React Native + Expo ~51
- Firebase 10 (Auth + Firestore)
- Anthropic Claude (claude-sonnet-4-6)
- Expo Location, Expo AV, Expo Clipboard

---
Built with 💙 for women's safety · India
