import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Listing } from '../types/listing';
import { useWishlist } from '@/context/WishlistContext';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(listing.id);

  const handleWishlist = (e: any) => {
    e.stopPropagation(); // Prevent navigation when clicking heart
    if (isWishlisted) {
      removeFromWishlist(listing.id);
    } else {
      addToWishlist(listing);
    }
  };
  return (
    <Link href={`/listing/${listing.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={handleWishlist}
          >
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={24} 
              color={isWishlisted ? "#FF5A5F" : "white"} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {listing.title}
            </Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FF5A5F" />
              <Text style={styles.ratingText}>{listing.rating}</Text>
            </View>
          </View>
          <Text style={styles.location}>{listing.location}</Text>
          <Text style={styles.price}>
            <Text style={styles.priceValue}>${listing.price}</Text> night
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginBottom: 20,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  location: {
    color: '#717171',
    fontSize: 14,
    marginTop: 2,
  },
  price: {
    marginTop: 4,
    fontSize: 14,
  },
  priceValue: {
    fontWeight: '600',
  },
});

export default ListingCard;