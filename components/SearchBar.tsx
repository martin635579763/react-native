import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  onPress?: () => void;
  searchContent?: {
    location: string;
    dates: string;
    guests: string;
  };
  setSearchContent?: (content:{ location: string; dates: string; guests: string; } | {
    location: '',
    dates: '',
    guests: ''
  }) => void;
}

const SearchBar = ({ onPress, searchContent, setSearchContent }: SearchBarProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#000" />
        <View style={styles.textContainer}>
          <Text style={styles.location}>
            {searchContent?.location || "Where to?"}
          </Text>
          <View style={styles.secondRow}>
            <Text style={styles.searchText}>
              {searchContent?.dates || "Any week"} · {searchContent?.guests || "Add guests"}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onPress}
        >
          <Ionicons name="options-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  location: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    fontSize: 12,
    color: "#717171",
    marginTop: 2,
  },
  filterButton: {
    padding: 4,
  },
});

export default SearchBar;
