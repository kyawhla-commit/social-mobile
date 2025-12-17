<p align="center">
  <img src="assets/images/icon.png" width="100" alt="Social Mobile Logo" />
</p>

<h1 align="center">Social Mobile</h1>

<p align="center">
  A modern, feature-rich social media mobile application built with React Native and Expo
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=flat-square&logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey?style=flat-square" alt="Platform" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure login & registration with JWT tokens |
| 📝 **Posts** | Create, view, and delete posts with rich content |
| ❤️ **Likes** | Animated like system with haptic feedback & optimistic updates |
| 💬 **Comments** | Real-time commenting on posts |
| 👤 **Profile** | Beautiful profile page with user stats and post history |
| ⚙️ **Settings** | App preferences, cache management, and account settings |
| 🔄 **Pull-to-Refresh** | Smooth refresh experience on all feeds |
| 📱 **Cross-Platform** | Runs on iOS, Android, and Web |

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Expo SDK 54](https://expo.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based) |
| State Management | [TanStack Query](https://tanstack.com/query) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Storage | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |
| Icons | [Expo Vector Icons](https://icons.expo.fyi/) |

## 📁 Project Structure

```
social-mobile/
├── app/                    # App screens (file-based routing)
│   ├── (home)/            # Tab navigation screens
│   │   ├── index.tsx      # Home feed
│   │   ├── profile.tsx    # User profile & auth
│   │   └── settings.tsx   # App settings
│   ├── post/
│   │   └── [id].tsx       # Post detail view
│   ├── _layout.tsx        # Root layout
│   └── form.tsx           # Create post modal
├── components/            # Reusable components
│   ├── AppProvider.tsx    # Auth & query context
│   ├── card.tsx           # Post card with animations
│   └── comment.tsx        # Comment component
├── types/
│   └── global.ts          # TypeScript definitions
├── config.ts              # API configuration
└── assets/                # Images, fonts, icons
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- [Expo Go](https://expo.dev/go) app (for physical device testing)
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd social-mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running the App

| Platform | Command | Alternative |
|----------|---------|-------------|
| iOS Simulator | `npm run ios` | Press `i` in terminal |
| Android Emulator | `npm run android` | Press `a` in terminal |
| Web Browser | `npm run web` | Press `w` in terminal |
| Physical Device | Scan QR code | Use Expo Go app |

## ⚙️ Configuration

### API Setup

The app connects to a REST API backend. Configure the API URL in `config.ts`:

```typescript
// config.ts
export const API_BASE_URL = "https://social-api-15e4.onrender.com";
```

### Local Development

For local backend development, use these addresses:

| Environment | API URL |
|-------------|---------|
| Production | `https://social-api-15e4.onrender.com` |
| iOS Simulator | `http://localhost:8800` |
| Android Emulator | `http://10.0.2.2:8800` |
| Physical Device | `http://<your-ip>:8800` |

> 💡 **Tip:** Find your local IP with `hostname -I | awk '{print $1}'` on Linux/Mac

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint for code quality |
| `npm run reset-project` | Reset to fresh project state |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users` | Register new user |
| `POST` | `/users/login` | User login |
| `GET` | `/users/verify` | Verify JWT token |
| `GET` | `/posts` | Get all posts |
| `POST` | `/posts` | Create new post |
| `DELETE` | `/posts/:id` | Delete a post |
| `POST` | `/posts/:id/like` | Like a post |
| `DELETE` | `/posts/:id/like` | Unlike a post |
| `POST` | `/comments` | Add comment |
| `DELETE` | `/comments/:id` | Delete comment |

## 🎨 Screenshots

<p align="center">
  <i>Screenshots coming soon...</i>
</p>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ using <a href="https://expo.dev">Expo</a> and <a href="https://reactnative.dev">React Native</a>
</p>
