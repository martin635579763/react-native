import React, { createContext, useContext, useState } from 'react';
import { Listing } from '../types/listing';

interface WishlistContextType {
  wishlist: Listing[];
  addToWishlist: (listing: Listing) => void;
  removeFromWishlist: (listingId: string) => void;
  isInWishlist: (listingId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Listing[]>([]);

  const addToWishlist = (listing: Listing) => {
    setWishlist(prev => [...prev, listing]);
  };

  const removeFromWishlist = (listingId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== listingId));
  };

  const isInWishlist = (listingId: string) => {
    return wishlist.some(item => item.id === listingId);
  };

  return (
    <WishlistContext.Provider 
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (undefined === context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 