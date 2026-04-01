import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Playlist {
  id: number;
  name: string;
  created_at: string;
  tracks_count?: number;
}

export interface PlaylistTrack {
  sc_track_id: number;
  title: string;
  artwork_url: string | null;
  duration?: number;
}

export interface Like {
  id: number;
  sc_track_id: number;
  title: string;
  artwork_url: string | null;
  duration: number;
  created_at: string;
}

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post<{ token: string }>('/register', { username, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<{ token: string }>('/login', { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/me');
  return response.data;
};

export const getPlaylists = async () => {
  const response = await api.get<Playlist[]>('/playlists');
  return response.data;
};

export const createPlaylist = async (name: string) => {
  const response = await api.post<Playlist>('/playlists', { name });
  return response.data;
};

export const deletePlaylist = async (id: number) => {
  await api.delete(`/playlists/${id}`);
};

export const addTrackToPlaylist = async (playlistId: number, track: PlaylistTrack) => {
  await api.post(`/playlists/${playlistId}/tracks`, track);
};

export const removeTrackFromPlaylist = async (playlistId: number, scTrackId: number) => {
  await api.delete(`/playlists/${playlistId}/tracks/${scTrackId}`);
};

export const getLikes = async () => {
  const response = await api.get<Like[]>('/likes');
  return response.data;
};

export const addLike = async (track: { sc_track_id: number; title: string; artwork_url: string | null; duration: number }) => {
  await api.post('/likes', track);
};

export const removeLike = async (scTrackId: number) => {
  await api.delete(`/likes/${scTrackId}`);
};
