import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { usePlayerStore } from '@/store/playerStore';
import TrackPlayer from 'react-native-track-player';
import { useRouter } from 'expo-router';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayback, playNext } = usePlayerStore();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (currentTrack) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const position = await TrackPlayer.getPosition();
        const duration = await TrackPlayer.getDuration();
        if (duration > 0) {
          setProgress(position / duration);
        }
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!currentTrack) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.content}
        onPress={() => router.push('/player')}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: (currentTrack.artwork as string) || 'https://via.placeholder.com/40' }}
          style={styles.artwork}
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        <TouchableOpacity style={styles.controlBtn} onPress={togglePlayback}>
          <Text style={styles.controlText}>{isPlaying ? '❚❚' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={playNext}>
          <Text style={styles.controlText}>⏭</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  progressBg: {
    height: 2,
    backgroundColor: '#333',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#FF5500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
  },
  controlBtn: {
    padding: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
  },
});
