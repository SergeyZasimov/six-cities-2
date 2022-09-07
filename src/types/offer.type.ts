import { City } from './city.type.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
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
  features: string[];
  host: User;
  commentsAmount: number;
  location: Location;
};
