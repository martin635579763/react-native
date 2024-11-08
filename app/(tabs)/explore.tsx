import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";


import { Listing } from "@/types/listing";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import FilterModal from '@/components/FilterModal';
import { DUMMY_LISTINGS } from "@/assets/data/listings";



const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function ExploreScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    checkIn: new Date(),
    checkOut: new Date(),
    travelers: 1,
  });
  const [searchContent, setSearchContent] = useState({
    location: '',
    dates: '',
    guests: ''
  });
  const [filteredListings, setFilteredListings] = useState(DUMMY_LISTINGS);

  const handleSearch = (searchString: string) => {
    // Parse the combined string
    const parts = searchString.split(' · ');
    
    setSearchContent({
      location: parts[0] || '', // Osaka
      dates: parts[1] || '',    // Nov 3, 2024 - Nov 3, 2024
      guests: parts[2] || ''    // 1 guest
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar 
        searchContent={searchContent}
        onPress={() => setModalVisible(true)} 
      />
      <FilterModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSearch={handleSearch}
        filters={filters}
        setFilters={setFilters}
        setSearchContent={(content) => content && setSearchContent(content)}
      />

     
      <FlatList
        data={DUMMY_LISTINGS}
        renderItem={({ item }) => <ListingCard listing={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
  },
 
  
});
