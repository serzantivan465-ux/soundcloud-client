import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Playlist } from '@/services/api';

interface PlaylistCardProps {
  playlist: Playlist;
  onPress: () => void;
}

export default function PlaylistCard({ playlist, onPress }: PlaylistCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🎵</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {playlist.name}
      </Text>
      <Text style={styles.count}>
        {playlist.tracks_count || 0} tracks
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    margin: 8,
  },
  placeholder: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  count: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});
