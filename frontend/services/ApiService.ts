import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.pulserise.app';
const TIMEOUT = Constants.expoConfig?.extra?.apiTimeout || 10000;
const AUTH_TOKEN_KEY = '@pulserise_auth_token';

/**
 * ApiService - Centralized HTTP client for Pulserise backend API.
 */
class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, displayName: string) {
    const response = await this.client.post('/auth/register', { email, password, displayName });
    return response.data;
  }

  async googleAuth(idToken: string) {
    const response = await this.client.post('/auth/google', { idToken });
    return response.data;
  }

  // User endpoints
  async getUserProfile(userId: string) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async updateUserProfile(userId: string, data: Record<string, unknown>) {
    const response = await this.client.put(`/users/${userId}`, data);
    return response.data;
  }

  // Workout endpoints
  async getWorkouts(userId: string) {
    const response = await this.client.get(`/workouts?userId=${userId}`);
    return response.data;
  }

  async createWorkout(data: Record<string, unknown>) {
    const response = await this.client.post('/workouts', data);
    return response.data;
  }

  async updateWorkout(workoutId: string, data: Record<string, unknown>) {
    const response = await this.client.put(`/workouts/${workoutId}`, data);
    return response.data;
  }

  async deleteWorkout(workoutId: string) {
    const response = await this.client.delete(`/workouts/${workoutId}`);
    return response.data;
  }

  // Analysis endpoints
  async getWorkoutHistory(userId: string, startDate?: string, endDate?: string) {
    const response = await this.client.get('/analysis/history', {
      params: { userId, startDate, endDate },
    });
    return response.data;
  }

  async getProgressStats(userId: string) {
    const response = await this.client.get(`/analysis/stats/${userId}`);
    return response.data;
  }

  // Community endpoints
  async getCommunityPosts(page: number = 1) {
    const response = await this.client.get('/community/posts', { params: { page } });
    return response.data;
  }

  async createPost(data: Record<string, unknown>) {
    const response = await this.client.post('/community/posts', data);
    return response.data;
  }
}

export default new ApiService();
