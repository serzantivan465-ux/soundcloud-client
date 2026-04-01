import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import TrackCard from '@/components/TrackCard';
import { SCTrack, getTrendingTracks } from '@/services/soundcloud';

export default function FeedScreen() {
  const [tracks, setTracks] = useState<SCTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTracks = async () => {
    try {
      const data = await getTrendingTracks(30);
      setTracks(data);
    } catch (e) {
      console.error('Failed to load trending tracks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTracks();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TrackCard track={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5500" />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
