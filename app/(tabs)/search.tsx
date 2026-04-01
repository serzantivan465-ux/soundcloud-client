import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import TrackCard from '@/components/TrackCard';
import { SCTrack, searchTracks } from '@/services/soundcloud';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<SCTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchTracks(query, 30);
      setTracks(data);
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search tracks..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF5500" />
        </View>
      )}
      {!loading && searched && tracks.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      )}
      {!loading && !searched && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Search for tracks on SoundCloud</Text>
        </View>
      )}
      <FlatList
        data={tracks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TrackCard track={item} />}
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
  searchBar: {
    padding: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  list: {
    paddingBottom: 60,
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
