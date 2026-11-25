# Rizal Virtual Tour

Deliverables in this repo:

- **Web app** — React + Vite + Tailwind, deployable to Vercel.
- **Expo Go app** — React Native app in `expo-app/` (`expo-router`, Expo SDK 58).
- **Android APK** — optional Capacitor build, generated at `rizal-virtual-tour.apk`.

## Web app / Vercel

```bash
npm install
npm run dev
npm run build
```

`vercel.json` configures Vercel to install with pnpm, run `npm run build`, and serve `dist/`.

## Expo Go

Install the latest **Expo Go** app on your phone, then:

```bash
cd expo-app
npm install
npx expo start
```

Scan the QR code with Expo Go on Android or the Camera app on iOS. The app uses the same tour content and questions as the web app. Images are loaded from this repo over the network, so keep internet enabled.

From the Home tab, tap **Edit** to open the Content studio. Changes are saved on the device and can be copied/pasted as JSON.

## Local APK (optional)

Requires Java 21 and Android SDK 36:

```bash
npm run apk:debug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.
