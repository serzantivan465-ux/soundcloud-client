import axios from 'axios';

const SC_CLIENT_ID = process.env.EXPO_PUBLIC_SC_CLIENT_ID || '';
const SC_BASE_URL = 'https://api.soundcloud.com';

const scApi = axios.create({
  baseURL: SC_BASE_URL,
  params: {
    client_id: SC_CLIENT_ID,
  },
});

export interface SCTrack {
  id: number;
  title: string;
  artwork_url: string | null;
  duration: number;
  user: {
    id: number;
    username: string;
    avatar_url: string | null;
  };
  permalink_url: string;
  stream_url?: string;
  playback_count: number;
  likes_count: number;
  genre?: string;
  description?: string;
}

export interface SCUser {
  id: number;
  username: string;
  avatar_url: string | null;
  permalink_url: string;
  followers_count: number;
  track_count: number;
}

export const searchTracks = async (query: string, limit = 20): Promise<SCTrack[]> => {
  const response = await scApi.get<SCTrack[]>('/tracks', {
    params: { q: query, limit },
  });
  return response.data;
};

export const getTrendingTracks = async (limit = 20): Promise<SCTrack[]> => {
  const response = await scApi.get<SCTrack[]>('/tracks', {
    params: { order: 'hotness', limit },
  });
  return response.data;
};

export const getTrack = async (id: number): Promise<SCTrack> => {
  const response = await scApi.get<SCTrack>(`/tracks/${id}`);
  return response.data;
};

export const getStreamUrl = async (id: number): Promise<string> => {
  const response = await scApi.get(`/tracks/${id}/stream`, {
    params: { client_id: SC_CLIENT_ID },
    maxRedirects: 0,
    validateStatus: (status) => status < 400,
  });
  return response.data.url || `${SC_BASE_URL}/tracks/${id}/stream?client_id=${SC_CLIENT_ID}`;
};

export const getUserTracks = async (userId: number, limit = 20): Promise<SCTrack[]> => {
  const response = await scApi.get<SCTrack[]>(`/users/${userId}/tracks`, {
    params: { limit },
  });
  return response.data;
};

export const getUser = async (userId: number): Promise<SCUser> => {
  const response = await scApi.get<SCUser>(`/users/${userId}`);
  return response.data;
};
