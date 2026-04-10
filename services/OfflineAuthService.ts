import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_USER_KEY = '@pulserise_offline_user';
const OFFLINE_SESSION_KEY = '@pulserise_offline_session';

export interface OfflineUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface OfflineSession {
  userId: string;
  token: string;
  expiresAt: string;
}

/**
 * OfflineAuthService - Manages local authentication state for offline support.
 * Falls back to cached credentials when the network is unavailable.
 */
class OfflineAuthService {
  /**
   * Saves a user profile locally for offline access.
   */
  async saveUser(user: OfflineUser): Promise<void> {
    await AsyncStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user));
  }

  /**
   * Retrieves the locally cached user profile.
   */
  async getUser(): Promise<OfflineUser | null> {
    const data = await AsyncStorage.getItem(OFFLINE_USER_KEY);
    if (!data) return null;
    return JSON.parse(data) as OfflineUser;
  }

  /**
   * Saves an offline session token.
   */
  async saveSession(session: OfflineSession): Promise<void> {
    await AsyncStorage.setItem(OFFLINE_SESSION_KEY, JSON.stringify(session));
  }

  /**
   * Retrieves the cached session and checks expiry.
   */
  async getValidSession(): Promise<OfflineSession | null> {
    const data = await AsyncStorage.getItem(OFFLINE_SESSION_KEY);
    if (!data) return null;
    const session = JSON.parse(data) as OfflineSession;
    if (new Date(session.expiresAt) < new Date()) {
      await this.clearSession();
      return null;
    }
    return session;
  }

  /**
   * Clears the stored session.
   */
  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(OFFLINE_SESSION_KEY);
  }

  /**
   * Clears all offline auth data (user + session).
   */
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([OFFLINE_USER_KEY, OFFLINE_SESSION_KEY]);
  }

  /**
   * Checks whether valid offline credentials exist.
   */
  async hasValidOfflineAuth(): Promise<boolean> {
    const user = await this.getUser();
    const session = await this.getValidSession();
    return user !== null && session !== null;
  }
}

export default new OfflineAuthService();
