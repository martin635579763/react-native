import { View, Text, StyleSheet, ListRenderItem } from 'react-native';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';

import { useCallback, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import ListingCard from './ListingCard';



interface Props {
  listings: any[];
  onSheetChange: (position: number) => void;
  selectedListing: string | null;
  snapPoints: string[];
  index: number;
}

const ListingsBottomSheet = forwardRef<BottomSheet, Props>(({ listings, onSheetChange, selectedListing, snapPoints, index }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);

  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => {
      bottomSheetRef.current?.snapToIndex(index);
    },
    snapToPosition: (position: string | number) => {
      bottomSheetRef.current?.snapToPosition(position);
    },
    expand: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
    close: () => bottomSheetRef.current?.close(),
    forceClose: () => bottomSheetRef.current?.forceClose()
  }));

  // Callbacks
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {listings.length} {listings.length === 1 ? 'home' : 'homes'}
      </Text>
    </View>
  ), [listings.length]);

  const renderItem = useCallback<ListRenderItem<any>>(({ item }) => (
    <ListingCard listing={item} />
  ), []);

  useEffect(() => {
    if (selectedListing) {
      const index = listings.findIndex(listing => listing.id === selectedListing);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    }
  }, [selectedListing]);

  const getItemLayout = (_: any, index: number) => ({
    length: 200, // height of each item
    offset: 200 * index,
    index,
  });

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      bottomSheetRef.current?.snapToIndex(info.index);
    });
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={index}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: 'gray' }}
      onChange={onSheetChange}
    >
      <BottomSheetFlatList
        ref={flatListRef}
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
    </BottomSheet>
  );
});

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  flatListContent: {
    gap: 10,
    padding: 10,
  },
  handle: {
    backgroundColor: '#ddd',
    width: 50,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    padding: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 