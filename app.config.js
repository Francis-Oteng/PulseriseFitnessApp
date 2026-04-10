export default {
  expo: {
    name: 'PulseriseFitnessApp',
    slug: 'PulseriseFitnessApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'pulserisefitnessapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#060F8A',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.francisoteng.pulserisefitnessapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#060F8A',
      },
      edgeToEdgeEnabled: true,
      package: 'com.francisoteng.pulserisefitnessapp',
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.MODIFY_AUDIO_SETTINGS',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#060F8A',
        },
      ],
      'expo-web-browser',
      [
        'expo-av',
        {
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          // Replace with your REVERSED_CLIENT_ID from GoogleService-Info.plist
          // See .env.example for instructions on how to obtain this value
          iosUrlScheme: 'com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        // Run `eas init` to generate your EAS project ID and update this value
        // See .env.example for more details
        projectId: 'your-eas-project-id',
      },
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.pulserise.app',
      apiTimeout: 10000,
      pexelsApiKey: process.env.EXPO_PUBLIC_PEXELS_API_KEY || '',
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    },
  },
};
