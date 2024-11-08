import { View, StyleSheet, Pressable, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DUMMY_LISTINGS } from "@/assets/data/listings";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import SearchBar from "@/components/SearchBar";
import MapView, { Marker, Region } from "react-native-maps";
import { useState, useRef } from "react";
import FilterModal from "@/components/FilterModal";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function LocationScreen() {
  const params= useLocalSearchParams<{ 
    location: string;
    dates: string;
    guests: string;
  }>();
  // console.log(location, dates, guests);
  // console.log("Params received:", {
  //   location: params.location,
  //   dates: params.dates,
  //   guests: params.guests
  // });
 
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    city: params.location,
    checkIn: new Date(),
    checkOut: new Date(),
    travelers: 1,
  });
  const [searchContent, setSearchContent] = useState({
    location: params.location || '',
    dates: params.dates || '',
    guests: params.guests || '',
  });


  const handleSearch = (searchString: string) => {
    const parts = searchString.split(" · ");
    setSearchContent({
      location: parts[0] || "",
      dates: parts[1] || "",
      guests: parts[2] || "",
    });
  };

  const filteredListings = DUMMY_LISTINGS.filter((listing) => {
    if (!params.location) return true;

    return (
      listing.location.toLowerCase().includes(params.location.toLowerCase()) ||
      listing.title.toLowerCase().includes(params.location.toLowerCase())
    );
  });
  // console.log(filteredListings)
  const initialRegion = filteredListings.length > 0
    ? {
        latitude: filteredListings[0].coordinates.latitude - 0.02,
        longitude: filteredListings[0].coordinates.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.0621,
      }
    : {
        latitude: 35.6762,
        longitude: 139.6503,
        latitudeDelta: 0.15,
        longitudeDelta: 0.0621,
      };
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState<Region>(initialRegion);

  const sheetPosition = useSharedValue(0);
  const mapZoom = useSharedValue(initialRegion.latitudeDelta);

  const onBottomSheetChange = (position: number) => {
    if (position >= 0) {
      sheetPosition.value = position;
      mapZoom.value = withTiming(
        initialRegion.latitudeDelta * (1 + (position * 0.5)),
        { duration: 150 }
      );
      
      if (mapRef.current && mapRegion) {
        setMapRegion({
          ...mapRegion,
          latitudeDelta: mapZoom.value,
          longitudeDelta: mapZoom.value * (initialRegion.longitudeDelta / initialRegion.latitudeDelta),
        });
      }
    }
  };

  // Add state for selected listing
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleMarkerPress = (listingId: string) => {
    setSelectedListing(listingId);
    setIsFullScreen(true);
  };

  const selectedListingData = filteredListings.find(listing => listing.id === selectedListing);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [
      { translateY: isFullScreen ? withTiming(0, { duration: 300 }) : withTiming(200, { duration: 300 }) }
    ],
  }));

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
        <SearchBar
          searchContent={searchContent}
          onPress={() => setShowFilterModal(true)}
        />
      <FilterModal
        isVisible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onSearch={handleSearch}
        filters={filters}
        setFilters={setFilters}
        setSearchContent={(content) => content && setSearchContent(content)}
      />
      <MapView 
        ref={mapRef}
        style={styles.map} 
        initialRegion={initialRegion}
        region={mapRegion}
      >
        {filteredListings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{
              latitude: listing.coordinates.latitude,
              longitude: listing.coordinates.longitude,
            }}
          >
            <Pressable 
              style={[
                styles.markerButton,
                selectedListing === listing.id && styles.selectedMarker
              ]}
              onPress={() => handleMarkerPress(listing.id)}
            >
              <Text style={[
                styles.markerText,
                selectedListing === listing.id && styles.selectedMarkerText
              ]}>${listing.price}</Text>
            </Pressable>
          </Marker>
        ))}
      </MapView>

      {!isFullScreen && (
        <ListingsBottomSheet 
          ref={bottomSheetRef}
          listings={filteredListings} 
          onSheetChange={onBottomSheetChange}
          selectedListing={null}
          snapPoints={['10%', '50%']}
          index={bottomSheetIndex}
        />
      )}

      {isFullScreen && selectedListingData && (
        <Animated.View style={cardAnimatedStyle}>
          <View style={styles.cardContent}>
            <Image source={{ uri: selectedListingData.image }} style={styles.listingImage} />
            <Pressable 
              onPress={() => {
                setIsFullScreen(false);
                setSelectedListing(null);
                setBottomSheetIndex(0);
                bottomSheetRef.current?.snapToIndex(0);
              }} 
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
            
            <View style={styles.listingDetails}>
              <Text style={styles.listingTitle}>{selectedListingData.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.listingPrice}>${selectedListingData.price}</Text>
                <Text style={styles.perNight}> / night</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  markerButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  selectedMarker: {
    backgroundColor: '#000',
  },
  markerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  selectedMarkerText: {
    color: '#fff',
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listingPrice: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    lineHeight: 18,
  },
  cardContent: {
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  listingDetails: {
    padding: 12,
  },
  listingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  perNight: {
    fontSize: 14,
    color: '#666',
  },
});