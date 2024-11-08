import { View, Text } from 'react-native';

interface ListingItemProps {
  listing: any;  // You should replace 'any' with your actual listing type
}

export default function ListingsItem({ listing }: ListingItemProps) {
  return (
    <View>
      <Text>{listing.title}</Text>
    </View>
  );
} 