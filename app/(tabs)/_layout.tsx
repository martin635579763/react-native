import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
import { Image } from 'react-native';


export default function TabsLayout() {
  const { isSignedIn} = useAuth();
  const { user } = useUser();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5A5F',
        headerShown: false,
        tabBarStyle: {
          borderTopColor: '#ddd',
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: 'Wishlists',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "heart" : "heart-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "airplane" : "airplane-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "chatbubble" : "chatbubble-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => 
            isSignedIn && user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                }}
              />
            ) : (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={size} 
                color={color} 
              />
            )
        }}
      />
    </Tabs>
  );
}