export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AmalaSpot {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  photo_url: string;
  verified: boolean;
  submitted_by: string;
  data_source: string;
  created_at: string;
  updated_at: string;
  verification_count?: number;
  rating?: number;
}

export interface Verification {
  id: string;
  spot_id: string;
  user_id: string;
  vote: 'approve' | 'reject';
  comment: string;
  created_at: string;
}

export interface ScrapedCandidate {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  photo_url: string;
  source_url: string;
  is_promoted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  query_text: string;
  voice_clip_url?: string;
  response_text: string;
  response_images?: string[];
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatResponse {
  response_text: string;
  suggested_spots: AmalaSpot[];
  response_images?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface SpotSubmission {
  name: string;
  description: string;
  lat: number;
  lng: number;
  photo_url: string;
}

export interface VerificationVote {
  spot_id: string;
  vote: 'approve' | 'reject';
  comment?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SpotFilters {
  search?: string;
  bounds?: MapBounds;
  verified_only?: boolean;
  rating_min?: number;
}