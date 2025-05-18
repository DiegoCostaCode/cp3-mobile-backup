import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'react-native';

export default function Layout() {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#007AFF" 
        translucent={false} 
      />
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Página Inicial',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="estoque"
          options={{
            title: 'Estoque',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="devs"
          options={{
            title: 'Devs',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="code-slash-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
