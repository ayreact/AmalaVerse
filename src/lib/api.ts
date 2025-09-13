import axios from 'axios';
import { 
  AmalaSpot, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  SpotSubmission,
  VerificationVote,
  ChatResponse,
  SpotFilters,
  Verification
} from '@/types';

// Configuration
const getApiBaseUrl = () => {
  try {
    const url = localStorage.getItem('api_base_url') || '';
    return url.replace(/\/$/, '');
  } catch {
    return '';
  }
};
const USE_MOCK_DATA = !getApiBaseUrl();

const api = axios.create({
  baseURL: getApiBaseUrl() || 'http://localhost:8000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Data
const mockSpots: AmalaSpot[] = [
  {
    id: '1',
    name: 'Mama Cass Buka',
    description: 'Authentic homestyle Amala with the softest texture. Famous for their gbegiri and ewedu combination.',
    lat: 6.5244,
    lng: 3.3792,
    photo_url: '/placeholder.svg',
    verified: true,
    submitted_by: 'user1',
    data_source: 'user_submission',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    verification_count: 8,
    rating: 4.7
  },
  {
    id: '2',
    name: 'Iya Risi Traditional Kitchen',
    description: 'Award-winning Amala spot in the heart of Mushin. Their secret is in the yam flour preparation.',
    lat: 6.5355,
    lng: 3.3516,
    photo_url: '/placeholder.svg',
    verified: true,
    submitted_by: 'user2',
    data_source: 'web_scraping',
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-12T14:20:00Z',
    verification_count: 12,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Abula Express',
    description: 'Modern Amala experience with traditional taste. Great ambiance and quick service.',
    lat: 6.4474,
    lng: 3.3903,
    photo_url: '/placeholder.svg',
    verified: false,
    submitted_by: 'user3',
    data_source: 'user_submission',
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-18T09:15:00Z',
    verification_count: 3,
    rating: 4.2
  },
];

const mockUser = {
  id: '1',
  username: 'amala_lover',
  email: 'user@example.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Auth API functions
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      return { user: mockUser, token };
    }
    
    try {
      const response = await api.post('/users/login/', credentials);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      return { user, token };
    } catch (error) {
      console.error('Login failed, using mock data:', error);
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      return { user: mockUser, token };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      return { user: { ...mockUser, username: data.username, email: data.email }, token };
    }
    
    try {
      const response = await api.post('/users/register/', data);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      return { user, token };
    } catch (error) {
      console.error('Registration failed, using mock data:', error);
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('auth_token', token);
      return { user: { ...mockUser, username: data.username, email: data.email }, token };
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
  }
};

// Spots API functions
export const spotsAPI = {
  async getSpots(filters?: SpotFilters): Promise<AmalaSpot[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredSpots = mockSpots;
      
      if (filters?.verified_only) {
        filteredSpots = filteredSpots.filter(spot => spot.verified);
      }
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredSpots = filteredSpots.filter(spot => 
          spot.name.toLowerCase().includes(search) || 
          spot.description.toLowerCase().includes(search)
        );
      }
      
      return filteredSpots;
    }
    
    try {
      const response = await api.get('/spots/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch spots, using mock data:', error);
      return mockSpots;
    }
  },

  async getSpot(id: string): Promise<AmalaSpot> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const spot = mockSpots.find(s => s.id === id);
      if (!spot) throw new Error('Spot not found');
      return spot;
    }
    
    try {
      const response = await api.get(`/spots/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch spot, using mock data:', error);
      const spot = mockSpots.find(s => s.id === id);
      if (!spot) throw new Error('Spot not found');
      return spot;
    }
  },

  async submitSpot(spot: SpotSubmission): Promise<AmalaSpot> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newSpot: AmalaSpot = {
        ...spot,
        id: Date.now().toString(),
        verified: false,
        submitted_by: mockUser.id,
        data_source: 'user_submission',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        verification_count: 0,
        rating: 0
      };
      return newSpot;
    }
    
    try {
      const response = await api.post('/spots/', spot);
      return response.data;
    } catch (error) {
      console.error('Failed to submit spot, using mock data:', error);
      const newSpot: AmalaSpot = {
        ...spot,
        id: Date.now().toString(),
        verified: false,
        submitted_by: mockUser.id,
        data_source: 'user_submission',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        verification_count: 0,
        rating: 0
      };
      return newSpot;
    }
  },

  async getTrendingSpots(): Promise<AmalaSpot[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockSpots.filter(spot => spot.verified).slice(0, 6);
    }
    
    try {
      const response = await api.get('/trending-spots/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending spots, using mock data:', error);
      return mockSpots.filter(spot => spot.verified).slice(0, 6);
    }
  }
};

// Verification API functions
export const verificationAPI = {
  async getVerificationQueue(): Promise<AmalaSpot[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSpots.filter(spot => !spot.verified);
    }
    
    try {
      const response = await api.get('/verification-queue/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch verification queue, using mock data:', error);
      return mockSpots.filter(spot => !spot.verified);
    }
  },

  async verifySpot(vote: VerificationVote): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    try {
      await api.post('/verify-spot/', vote);
    } catch (error) {
      console.error('Failed to verify spot, using mock response:', error);
    }
  }
};

// Chat API functions
export const chatAPI = {
  async sendMessage(message: string, context?: any): Promise<ChatResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        response_text: `I found some great Amala spots based on your query: "${message}". Here are my recommendations with authentic flavors and great reviews!`,
        suggested_spots: mockSpots.slice(0, 2),
        response_images: []
      };
    }
    
    try {
      const response = await api.post('/chat/', { query_text: message, context });
      return response.data;
    } catch (error) {
      console.error('Chat failed, using mock response:', error);
      return {
        response_text: `I found some great Amala spots based on your query: "${message}". Here are my recommendations with authentic flavors and great reviews!`,
        suggested_spots: mockSpots.slice(0, 2),
        response_images: []
      };
    }
  },

  async transcribeVoice(audioBlob: Blob): Promise<string> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return "Find me the best Amala spot near Victoria Island";
    }
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      const response = await api.post('/voice/transcribe/', formData);
      return response.data.transcript;
    } catch (error) {
      console.error('Voice transcription failed, using mock response:', error);
      return "Find me the best Amala spot near Victoria Island";
    }
  }
};