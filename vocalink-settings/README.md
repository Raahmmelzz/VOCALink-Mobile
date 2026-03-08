# VocaLink Settings — React Native (Expo)

A React Native port of the VocaLink Settings UI, fully compatible with **Expo Go**.

## Project Structure

```
vocalink-settings/
├── expo-entry.js          ← Expo entry point
├── app.json               ← Expo config
├── babel.config.js
├── package.json
└── src/
    ├── App.jsx            ← Root component
    ├── theme/
    │   └── index.js       ← Colors, fonts, radii, shadows
    ├── hooks/
    │   ├── useAppNavigation.js
    │   ├── useSettings.js
    │   └── useToast.js
    ├── components/
    │   ├── StatusBar.jsx
    │   ├── BottomNav.jsx
    │   ├── Toggle.jsx
    │   ├── SettingRow.jsx
    │   ├── HeroBar.jsx
    │   ├── SectionCard.jsx
    │   └── Toast.jsx
    └── screens/
        ├── SettingsScreen.jsx
        ├── NotificationsScreen.jsx
        ├── AppearanceScreen.jsx
        ├── PrivacyScreen.jsx
        └── ProfileScreen.jsx
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your phone (iOS or Android)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npx expo start

# 3. Scan the QR code with Expo Go (Android)
#    or the Camera app (iOS)
```

### Run on specific platform
```bash
npx expo start --android
npx expo start --ios
```

## Screens

| Screen | Description |
|---|---|
| Settings | Main hub — profile card, preferences, app & support groups |
| Notifications | Push toggle, alert types, delivery channels, quiet hours |
| Appearance | Theme picker, font size, accent color, layout toggles |
| Privacy & Security | Password change form |
| Profile | Edit name, email, role, language, timezone |

## Dependencies

All included in `package.json` and work with **Expo Go** out of the box:

- `expo-linear-gradient` — gradient headers & profile card
- `@expo/vector-icons` — Ionicons for all icons
- `react-native-safe-area-context` — safe insets for notch/home indicator
- `react-native-screens` — native screen primitives
