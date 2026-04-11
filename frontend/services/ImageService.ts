import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.pulserise.app';
const TIMEOUT = Constants.expoConfig?.extra?.apiTimeout || 10000;
const PEXELS_API_KEY = Constants.expoConfig?.extra?.pexelsApiKey || '';

export interface PexelsPhoto {
  id: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

const pexelsClient = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  timeout: TIMEOUT,
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

/**
 * ImageService - Handles workout and profile image fetching from Pexels.
 */
class ImageService {
  /**
   * Search for workout images by query.
   */
  async searchWorkoutImages(
    query: string,
    perPage: number = 10,
    page: number = 1
  ): Promise<PexelsPhoto[]> {
    if (!PEXELS_API_KEY) {
      console.warn('ImageService: No Pexels API key configured.');
      return [];
    }
    const response = await pexelsClient.get('/search', {
      params: {
        query,
        per_page: perPage,
        page,
        orientation: 'landscape',
      },
    });
    return response.data.photos as PexelsPhoto[];
  }

  /**
   * Get a curated list of fitness photos.
   */
  async getCuratedFitnessPhotos(perPage: number = 10): Promise<PexelsPhoto[]> {
    return this.searchWorkoutImages('fitness workout gym exercise', perPage);
  }

  /**
   * Get an image for a specific exercise type.
   */
  async getExerciseImage(exerciseName: string): Promise<PexelsPhoto | null> {
    const photos = await this.searchWorkoutImages(exerciseName, 1);
    return photos.length > 0 ? photos[0] : null;
  }
}

export default new ImageService();
