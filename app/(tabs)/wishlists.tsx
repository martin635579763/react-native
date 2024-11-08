import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWishlist } from '../../context/WishlistContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Add this interface at the top of the file, after the imports
interface WishlistItem {
  id: string;
  image: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
}

export default function WishlistsScreen() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => router.push(`/listing/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        
        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {item.location}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FF5A5F" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews} reviews)</Text>
            </View>
            <Text style={styles.price}>${item.price} / night</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Ionicons name="heart" size={24} color="#FF5A5F" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlists</Text>
        <Text style={styles.subtitle}>{wishlist.length} saved places</Text>
      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={48} color="#666" />
          <Text style={styles.emptyStateText}>
            No saved properties yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Click the heart icon on any property to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 