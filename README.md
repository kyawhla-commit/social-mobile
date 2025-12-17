# Social Mobile

A React Native social media mobile app built with Expo and TypeScript.

## Features

- 📱 Cross-platform (iOS, Android, Web)
- 🔐 User authentication (login & registration)
- 📝 Create, view, and delete posts
- ❤️ Like/unlike posts
- 💬 Add and delete comments
- 👤 User profile with posts history
- ⚙️ Settings with cache management
- 🔄 Pull-to-refresh on feed
- 🌙 Automatic dark/light mode support

## Tech Stack

- **Framework:** Expo SDK 54
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Query (@tanstack/react-query)
- **Storage:** AsyncStorage
- **UI:** React Native with Expo Vector Icons

## Project Structure

```
social-mobile/
├── app/
│   ├── (home)/
│   │   ├── index.tsx      # Home feed
│   │   ├── profile.tsx    # User profile
│   │   └── settings.tsx   # App settings
│   ├── post/
│   │   └── [id].tsx       # Post detail view
│   ├── _layout.tsx        # Root layout
│   └── form.tsx           # Create post form
├── components/
│   ├── AppProvider.tsx    # Auth & query context
│   ├── card.tsx           # Post card component
│   └── comment.tsx        # Comment component
├── types/
│   └── global.ts          # TypeScript types
├── config.ts              # API configuration
└── assets/                # Images and icons
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

After starting the dev server, you can run the app on:

- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Web Browser:** Press `w`
- **Expo Go:** Scan the QR code with your phone

## API Configuration

The app connects to a backend API. Update the API URL in `config.ts` to match your backend server address:

```typescript
// config.ts
export const API_BASE_URL = "http://192.168.100.25:8800";
```

### API Address by Platform

| Platform | API Address |
|----------|-------------|
| iOS Simulator | `http://localhost:8800` |
| Android Emulator | `http://10.0.2.2:8800` |
| Physical Device | `http://<your-local-ip>:8800` |

> **Note:** Android emulator uses `10.0.2.2` to access the host machine's localhost. For physical devices, use your computer's local IP address (e.g., `192.168.1.x`).

### Finding Your Local IP

```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Or check network settings
ip addr show | grep "inet "
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to blank project |

## License

Private project
