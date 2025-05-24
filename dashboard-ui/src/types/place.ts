export interface Coordinate {
  lat: number;
  lon: number;
}

export interface Place {
  id?: number;
  title: string;
  description: string;
  shortDescription: string;
  address: string;
  url: string;
  source: string;
  images: string[];
  location: Coordinate;
  priceAvg: number;
  reviewRating: number;
  reviewCount: number;
  boost: number;
  boostRadius: number;
  tags: number[];
  updatedAt?: string;
}

export interface PlaceFilter {
  search?: string;
  tags?: string[];
  id?: number;
}

export interface PlacePatch {
  id?: number;
  title?: string;
  description?: string;
  shortDescription?: string;
  address?: string;
  url?: string;
  source?: string;
  images?: string[];
  location?: Coordinate;
  priceMin?: number;
  reviewRating?: number;
  reviewCount?: number;
  boost?: number;
  boostRadius?: number;
  tags?: number[];
} 