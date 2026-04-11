import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import ApiService from '@/services/ApiService';
import OfflineAuthService from '@/services/OfflineAuthService';

const GOOGLE_WEB_CLIENT_ID =
  Constants.expoConfig?.extra?.googleWebClientId || '';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isOffline?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setOnboarded: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDED_KEY = '@pulserise_onboarded';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
    });
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const hasOfflineAuth = await OfflineAuthService.hasValidOfflineAuth();
      if (hasOfflineAuth) {
        const offlineUser = await OfflineAuthService.getUser();
        if (offlineUser) {
          setUser({ ...offlineUser, isOffline: true });
        }
      }
      const onboarded = await AsyncStorage.getItem(ONBOARDED_KEY);
      setIsOnboarded(onboarded === 'true');
    } catch (error) {
      console.error('AuthContext: init error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await ApiService.login(email, password);
      const authUser: User = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await ApiService.setAuthToken(result.token);
      await OfflineAuthService.saveUser({ ...authUser, createdAt: new Date().toISOString() });
      await OfflineAuthService.saveSession({
        userId: authUser.id,
        token: result.token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      const result = await ApiService.register(email, password, displayName);
      const authUser: User = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
      };
      await ApiService.setAuthToken(result.token);
      await OfflineAuthService.saveUser({ ...authUser, createdAt: new Date().toISOString() });
      await OfflineAuthService.saveSession({
        userId: authUser.id,
        token: result.token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error('No ID token returned from Google SignIn');

      const result = await ApiService.googleAuth(idToken);
      const authUser: User = {
        id: result.user.id,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await ApiService.setAuthToken(result.token);
      await OfflineAuthService.saveUser({ ...authUser, createdAt: new Date().toISOString() });
      await OfflineAuthService.saveSession({
        userId: authUser.id,
        token: result.token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setUser(authUser);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === statusCodes.SIGN_IN_CANCELLED
      ) {
        return;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.signOut().catch(() => {});
      await ApiService.clearAuthToken();
      await OfflineAuthService.clearAll();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const setOnboarded = async () => {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        setOnboarded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
