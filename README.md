# Social Mobile

A social media app built with React Native, Expo, and TypeScript.

## Features

- User authentication (login & register)
- Create, view, and delete posts
- Like posts with animations
- Comment on posts
- User profile with post history
- Pull-to-refresh
- Cross-platform (iOS, Android, Web)

## Tech Stack

- Expo SDK 54
- TypeScript
- Expo Router
- TanStack Query
- React Native Reanimated
- AsyncStorage

## Quick Start

```bash
npm install
npx expo start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

## API Configuration

Edit `config.ts` to set your API URL:

```typescript
export const API_BASE_URL = "https://social-api-15e4.onrender.com";
```

For local development:
- iOS Simulator: `http://localhost:8800`
- Android Emulator: `http://10.0.2.2:8800`
- Physical device: `http://<your-ip>:8800`

## Project Structure

```
app/
├── (home)/
│   ├── index.tsx      # Feed
│   ├── profile.tsx    # Profile & Auth
│   └── settings.tsx   # Settings
├── post/[id].tsx      # Post detail
└── form.tsx           # Create post

components/
├── AppProvider.tsx    # Context
├── card.tsx           # Post card
└── comment.tsx        # Comment
```

## Scripts

- `npm start` - Start dev server
- `npm run ios` - Run on iOS
- `npm run android` - Run on Android
- `npm run web` - Run on web
- `npm run lint` - Lint code

## License

Private
