export interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  reviews: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  amenities?: string[];
  host?: {
    name: string;
    image: string;
    rating: number;
  };
}

export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  dates?: {
    startDate: Date;
    endDate: Date;
  };
  guests?: number;
} 