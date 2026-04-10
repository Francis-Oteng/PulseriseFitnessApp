# Pulserise Fitness App

A comprehensive React Native fitness application built with Expo, featuring authentication, workout tracking, progress analysis, community features, and more.

## Features

- **Authentication**: Email/password, Google Sign-In, and offline auth fallback
- **Onboarding**: Step-by-step setup (parameters → goals → fitness level → training days)
- **Workout Tracking**: Full workout library with rest timer (audio cues) and progress tracking
- **Analysis**: Workout history, personal records, and progress charts
- **Community**: Social feed, fitness challenges, and leaderboard
- **Profile Management**: Weekly calendar view, stats, and avatar upload
- **Settings**: Comprehensive preferences including units, notifications, and sound

## Tech Stack

- **Framework**: Expo (React Native) with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Google Sign-In + Email auth + Offline fallback
- **Storage**: AsyncStorage for local data persistence
- **Audio**: expo-av for rest timer beeps
- **Image**: expo-image-picker + Pexels API integration
- **HTTP**: Axios for API calls
- **Build**: EAS Build

## Getting Started

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

## Project Structure

```
app/
├── (auth)/          # Login and registration screens
├── (onboarding)/    # 4-step onboarding flow
├── (tabs)/          # Main tab navigation
│   ├── workout      # Workout library and today's plan
│   ├── analysis     # Progress tracking and stats
│   ├── community    # Social feed and challenges
│   └── profile      # User profile and calendar
├── workout/         # Workout detail and rest timer
└── settings.tsx     # App settings

contexts/            # React contexts (Auth, Workout)
services/            # API, Image, and Offline auth services
utils/               # Safe number utilities
assets/              # Images, fonts, and sounds
```

## Environment Variables

See `.env.example` for required environment variables:
- `EXPO_PUBLIC_API_BASE_URL` - Backend API URL
- `EXPO_PUBLIC_PEXELS_API_KEY` - Pexels API for workout images
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` - Google OAuth client ID

## Build

```bash
# Development build
eas build --profile development

# Production build
eas build --profile production
```
