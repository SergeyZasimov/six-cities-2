import { City } from './city.type.js';
import { FeatureType } from './feature-type.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  rooms: number;
  guests: number;
  price: number;
  features: FeatureType[];
  host: User;
  location: Location;
};
