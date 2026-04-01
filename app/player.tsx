import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '@/store/playerStore';
import TrackPlayer from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayback, playNext, playPrevious } = usePlayerStore();
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const pos = await TrackPlayer.getPosition();
        const dur = await TrackPlayer.getDuration();
        setPosition(pos);
        setDuration(dur);
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No track playing</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>↓</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={{ uri: (currentTrack.artwork as string) || 'https://via.placeholder.com/300' }}
          style={styles.artwork}
        />

        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.slider}
            value={position}
            minimumValue={0}
            maximumValue={duration || 1}
            minimumTrackTintColor="#FF5500"
            maximumTrackTintColor="#444"
            thumbTintColor="#FF5500"
            onSlidingComplete={async (value: number) => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={playPrevious}>
            <Text style={styles.controlText}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={togglePlayback}>
            <Text style={styles.playText}>{isPlaying ? '❚❚' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={playNext}>
            <Text style={styles.controlText}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backBtn: {
    padding: 16,
    paddingTop: 48,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  artwork: {
    width: width - 64,
    height: width - 64,
    borderRadius: 12,
    backgroundColor: '#222',
  },
  trackInfo: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 40,
  },
  controlBtn: {
    padding: 16,
  },
  controlText: {
    color: '#fff',
    fontSize: 28,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF5500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#fff',
    fontSize: 28,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
