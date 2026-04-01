import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import * as api from '@/services/api';
import PlaylistCard from '@/components/PlaylistCard';
import TrackCard from '@/components/TrackCard';
import { SCTrack } from '@/services/soundcloud';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<'playlists' | 'likes'>('playlists');
  const [playlists, setPlaylists] = useState<api.Playlist[]>([]);
  const [likes, setLikes] = useState<api.Like[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, logout } = useAuthStore();

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'playlists') {
        const data = await api.getPlaylists();
        setPlaylists(data);
      } else {
        const data = await api.getLikes();
        setLikes(data);
      }
    } catch (e) {
      console.error('Failed to load library:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const renderPlaylists = () => (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Playlists</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Coming soon', 'Create playlist feature')}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      {playlists.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No playlists yet</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => (
            <PlaylistCard
              playlist={item}
              onPress={() => Alert.alert('Playlist', item.name)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );

  const renderLikes = () => (
    <View style={styles.container}>
      <Text style={styles.header}>Liked Tracks</Text>
      {likes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No liked tracks yet</Text>
        </View>
      ) : (
        <FlatList
          data={likes.map((like) => ({
            id: like.sc_track_id,
            title: like.title,
            artwork_url: like.artwork_url,
            duration: like.duration,
            user: { id: 0, username: 'Unknown', avatar_url: null },
            playback_count: 0,
            likes_count: 0,
            permalink_url: '',
          } as SCTrack))}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <TrackCard track={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );

  if (!token) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Please log in to view your library</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'playlists' && styles.tabActive]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text style={[styles.tabText, activeTab === 'playlists' && styles.tabTextActive]}>
            Playlists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likes' && styles.tabActive]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={[styles.tabText, activeTab === 'likes' && styles.tabTextActive]}>
            Likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF5500" />
        </View>
      ) : activeTab === 'playlists' ? (
        renderPlaylists()
      ) : (
        renderLikes()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1e1e1e',
  },
  tabActive: {
    backgroundColor: '#FF5500',
  },
  tabText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  logoutBtn: {
    marginLeft: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 14,
  },
  list: {
    paddingBottom: 60,
    justifyContent: 'center',
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
  addButton: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
