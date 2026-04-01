import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5500',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#333',
        },
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabIcon name="🏠" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabIcon name="🔍" />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <TabIcon name="📚" />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name }: { name: string }) {
  return <TabIconText>{name}</TabIconText>;
}

function TabIconText({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
