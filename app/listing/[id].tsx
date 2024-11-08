import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import MapView, { Marker } from 'react-native-maps';
import { DUMMY_LISTINGS } from '@/assets/data/listings';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const listing = DUMMY_LISTINGS.find(item => item.id === id);

  // Add this function to handle back navigation
  const handleBack = () => {
    router.back(); // or router.push('/(tabs)/explore');
  };

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Listing not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Add Stack.Screen for header configuration */}
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ),
          headerTitle: "Listing Details",
        }}
      />

      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: listing.image }} style={styles.image} />
        
        {/* Add a floating back button over the image */}
        <TouchableOpacity 
          style={styles.floatingBackButton}
          onPress={handleBack}
        >
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FF5A5F" />
              <Text style={styles.ratingText}>{listing.rating}</Text>
              <Text style={styles.bulletPoint}> · </Text>
              <Text style={styles.reviewsText}>{listing.reviews} reviews</Text>
            </View>
            <Text style={styles.location}>{listing.location}</Text>
          </View>

          <View style={styles.divider} />

          {listing.host && (
            <>
              <View style={styles.hostSection}>
                <Image source={{ uri: listing.host.image }} style={styles.hostImage} />
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>Hosted by {listing.host.name}</Text>
                  <View style={styles.hostRating}>
                    <Ionicons name="star" size={14} color="#FF5A5F" />
                    <Text style={styles.hostRatingText}>{listing.host.rating} rating</Text>
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <Text style={styles.description}>{listing.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {listing.amenities?.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#484848" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              ...listing.coordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={listing.coordinates} />
          </MapView>
        </View>
      </ScrollView>

      {/* Footer with back button option */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${listing.price}</Text>
          <Text style={styles.night}> / night</Text>
        </View>
        <View style={styles.footerButtons}>
          <TouchableOpacity 
            style={styles.backToExplore}
            onPress={handleBack}
          >
            <Text style={styles.backToExploreText}>Back to Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reserveButton}>
            <Text style={styles.reserveButtonText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#000',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    backgroundColor: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  night: {
    fontSize: 16,
    color: '#666',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backToExplore: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5A5F',
    marginRight: 10,
  },
  backToExploreText: {
    color: '#FF5A5F',
    fontSize: 16,
    fontWeight: '600',
  },
  reserveButton: {
    backgroundColor: '#FF5A5F',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingRow: {
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666',
  },
  reviewsText: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hostImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostRatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 16,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#484848',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  

  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  priceNight: {
    fontSize: 18,
    color: '#666',
  },
  
  // ... rest of your existing styles ...
});