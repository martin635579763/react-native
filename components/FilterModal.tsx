import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';


interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSearch: (searchContent: string) => void;
  filters: {
    city: string;
    checkIn: Date;
    checkOut: Date;
    travelers: number;
  };
  setFilters: (filters: any) => void;
  setSearchContent: (content: { location: string; dates: string; guests: string; } | {location: '', dates: '', guests: ''}) => void;
}

// Add some major Japanese cities
const JAPAN_CITIES = [
  "Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo", 
  "Nagoya", "Yokohama", "Kobe", "Nara", "Hiroshima"
];

export default function FilterModal({ 
  isVisible, 
  onClose, 
  onSearch, 
  filters, 
  setFilters,
  setSearchContent,
}: FilterModalProps) {
  const router = useRouter();
  const [searchCity, setSearchCity] = useState(filters.city);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleCitySelect = (city: string) => {
    setSearchCity(city);
    setFilters((prev: any) => ({
      ...prev,
      city: city
    }));
  };

  const handleDateSelect = (date: DateData) => {
    const selectedDate = new Date(date.dateString);
    setFilters((prev: any) => {
      // If no checkIn date or selecting earlier than current checkIn
      if (!prev.checkIn || (prev.checkIn && prev.checkOut)) {
        return {
          ...prev,
          checkIn: selectedDate,
          checkOut: null,
        };
      }
      // If we have checkIn but no checkOut, set checkOut
      if (prev.checkIn && !prev.checkOut && selectedDate > prev.checkIn) {
        return {
          ...prev,
          checkOut: selectedDate,
        };
      }
      // If selecting a date before checkIn, reset and start new selection
      return {
        ...prev,
        checkIn: selectedDate,
        checkOut: null,
      };
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Add this helper function to get dates between checkIn and checkOut
  const getDatesInRange = (startDate: Date, endDate: Date) => {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1); // Start from day after checkIn

    while (currentDate < endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
  const handleCancel = () => {
    // Clear both search content and filters
    setSearchContent({location: '', dates: '', guests: ''});
    setFilters({
      city: '',
      checkIn: new Date(),
      checkOut: new Date(),
      travelers: 1
    });
    setSearchCity(''); // Clear local state
    // onClose();
  };

  const handleSearch = () => {
    if (filters.city && filters.checkIn && filters.checkOut) {
      const searchContent = `${filters.city} · ${formatDate(filters.checkIn)} - ${formatDate(filters.checkOut)} · ${filters.travelers} guest${filters.travelers > 1 ? 's' : ''}`;
      onSearch(searchContent);
      
      const dates = `${formatDate(filters.checkIn)}-${formatDate(filters.checkOut)}`;
      router.push({
        pathname: '/search/[location]',
        params: {
          location: filters.city.toLowerCase(),
          dates: dates,
          guests: filters.travelers.toString()
        }
      });
    } else {
      router.push('/');
    }
    onClose();
  };



  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Search Filters</Text>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={searchCity}
              onChangeText={(text) => {
                setSearchCity(text);
                setFilters((prev: any) => ({ ...prev, city: text }));
              }}
            />
          </View>

          {/* City Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityButtonsContainer}>
            {JAPAN_CITIES.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.cityButton}
                onPress={() => handleCitySelect(city)}
              >
                <Text style={styles.cityButtonText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date Selection */}
          <TouchableOpacity 
            style={styles.filterItem}
            onPress={() => setShowCalendar(true)}
          >
            <Text>
              {formatDate(filters.checkIn)} - {filters.checkOut ? formatDate(filters.checkOut) : 'Select date'}
            </Text>
          </TouchableOpacity>

          {/* Travelers Selection */}
          <View style={styles.travelersContainer}>
            <Text>Travelers</Text>
            <TouchableOpacity
              onPress={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  travelers: Math.max(1, prev.travelers - 1),
                }))
              }
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text>{filters.travelers}</Text>
            <TouchableOpacity
              onPress={() =>
                setFilters((prev: any) => ({
                  ...prev,
                  travelers: prev.travelers + 1,
                }))
              }
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCancel}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.searchButton]}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modified Calendar Modal */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            minDate={new Date().toISOString()}
            onDayPress={handleDateSelect}
            markingType={'period'}
            markedDates={{
              ...(filters.checkIn && {
                [filters.checkIn.toISOString().split('T')[0]]: { 
                  selected: true,
                  startingDay: true,
                  color: '#FF385C',
                  textColor: 'white'
                }
              }),
              ...(filters.checkOut && {
                [filters.checkOut.toISOString().split('T')[0]]: { 
                  selected: true,
                  endingDay: true,
                  color: '#FF385C',
                  textColor: 'white'
                },
                // Add period marking for dates between checkIn and checkOut
                ...getDatesInRange(filters.checkIn, filters.checkOut).reduce((acc, date) => ({
                  ...acc,
                  [date]: {
                    color: '#bc9da1',
                    textColor: '#000000'
                  }
                }), {})
              })
            }}
            theme={{
              todayTextColor: '#FF385C',
              selectedDayBackgroundColor: '#FF385C',
              selectedDayTextColor: '#ffffff',
            }}
          />
          <TouchableOpacity 
            style={styles.closeCalendarButton}
            onPress={() => setShowCalendar(false)}
          >
            <Text>Close Calendar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Copy all the modal-related styles from your explore.tsx
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  travelersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchButton: {
    backgroundColor: "#FF385C",
    borderColor: "#FF385C",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  cityButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  cityButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  cityButtonText: {
    fontSize: 14,
  },
  calendarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 1000,
  },
  closeCalendarButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  // ... rest of your modal styles ...
}); 