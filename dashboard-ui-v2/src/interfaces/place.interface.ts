export interface Tag {
  icon: string;
  id: number;
  name: string;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface Place {
  address: string;
  description: string;
  id: number;
  images: string[];
  location: Location;
  priceAvg: number;
  reviewCount: number;
  reviewRating: number;
  shortDescription: string;
  tags: Tag[];
  title: string;
  updatedAt: string;
  boost: number | null;
  boostRadius: number | null;
}
