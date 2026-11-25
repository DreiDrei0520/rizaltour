# Rizal Virtual Tour

Deliverables in this repo:

- **Web app** — React + Vite + Tailwind, deployable to Vercel.
- **Expo Go app** — React Native app in `expo-app/` (`expo-router`, Expo SDK 58).

## Web app / Vercel

```bash
npm install
npm run dev
npm run build
```

The deployed web app is **view-only**: questions, details, and other tour content are not editable there. Editing is available only in the Expo Go app.

`vercel.json` configures Vercel to install with pnpm, run `npm run build`, and serve `dist/`.

## Expo Go guide

### 1. I-install ang Expo Go sa phone

- Android: i-download ang **Expo Go** sa Google Play Store.
- iOS: i-download ang **Expo Go** sa App Store.
- Ilagay sa iisang Wi-Fi ang phone at computer.

### 2. I-start ang app sa computer

Kailangan ang Node.js 20 o mas bago. Sa project root:

```bash
npm run expo:start
```

O kung nasa loob ka na ng `expo-app/`:

```bash
cd expo-app
npm install
npx expo start
```

Kung unang beses, hintayin matapos ang `npm install`.

### 3. I-scan ang QR code

Lalabas sa terminal ang QR code at isang URL tulad ng `exp://...`.

- **Android:** buksan ang Expo Go → tap **Scan QR code** → i-scan ang QR sa terminal.
- **iOS:** gamitin ang Camera app → i-scan ang QR → tap **Open in Expo Go**.

Kung hindi mag-scan dahil ibang network, gamitin ang tunnel:

```bash
cd expo-app
npx expo start --tunnel
```

### 4. Gamitin ang app

May limang tab ang app:

- **Home** — intro at starting point.
- **Map** — location at directions.
- **Tour** — tunay na 360° Pannellum view ng gardens, sala, at dining room, may clickable hotspots. Pwede pumili ng **Use classic view** kung gusto ng simple directional images.
- **Quiz** — mga tanong mula sa tour.
- **Progress** — history ng quiz at saved progress.

Sa **Home**, tap ang **Edit** para buksan ang Content studio. Pwede baguhin ang questions, stops, at information. Naka-save ang changes sa phone, at pwede i-export/import bilang JSON.

### 5. Mga tips at troubleshooting

- Kung walang lumalabas na images o 360° view, kailangan ng internet—nasa GitHub raw URLs ang images at Pannellum CDN ang viewer.
- Kung lumang Expo Go ang phone, i-update ito para suportado ang SDK 58.
- Kung may missing package, ulitin ang `npm install` sa loob ng `expo-app/`.
- I-refresh ang app sa pamamagitan ng pag-pindot ng `r` sa terminal.
- I-stop ang server gamit ang `Ctrl + C`.
