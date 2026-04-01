import { create } from 'zustand';
import TrackPlayer, { State, Track, Capability } from 'react-native-track-player';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  initPlayer: () => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  togglePlayback: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  addToQueue: (track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],

  initPlayer: async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
    });
  },

  playTrack: async (track) => {
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
    set({ currentTrack: track, isPlaying: true });
  },

  togglePlayback: async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      set({ isPlaying: false });
    } else {
      await TrackPlayer.play();
      set({ isPlaying: true });
    }
  },

  playNext: async () => {
    await TrackPlayer.skipToNext();
    const track = await TrackPlayer.getActiveTrack();
    set({ currentTrack: track || null, isPlaying: true });
  },

  playPrevious: async () => {
    await TrackPlayer.skipToPrevious();
    const track = await TrackPlayer.getActiveTrack();
    set({ currentTrack: track || null, isPlaying: true });
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },
}));
