import { useRouter } from 'expo-router';
import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user } = useUser();
  const router = useRouter();

  const onSignInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.push('/(tabs)/explore');
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <View style={styles.container}>
      {!isSignedIn ? (
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={onSignInWithGoogle}
        >
          <Text style={styles.buttonText}>
            Sign in with Google
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: user?.imageUrl }} 
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});