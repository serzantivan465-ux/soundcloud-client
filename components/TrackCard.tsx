import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SCTrack } from '@/services/soundcloud';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'expo-router';

interface TrackCardProps {
  track: SCTrack;
}

export default function TrackCard({ track }: TrackCardProps) {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const router = useRouter();

  const handlePress = () => {
    const playerTrack = {
      id: String(track.id),
      url: `https://api.soundcloud.com/tracks/${track.id}/stream?client_id=${process.env.EXPO_PUBLIC_SC_CLIENT_ID}`,
      title: track.title,
      artist: track.user.username,
      artwork: track.artwork_url || undefined,
      duration: track.duration / 1000,
    };
    playTrack(playerTrack);
    router.push('/player');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Image
        source={{ uri: track.artwork_url || 'https://via.placeholder.com/120' }}
        style={styles.artwork}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.user.username}
        </Text>
        <Text style={styles.meta}>
          {formatDuration(track.duration)} • {formatCount(track.playback_count)} plays
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  meta: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});
