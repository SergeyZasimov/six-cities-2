import { Offer } from '../types/offer.type.js';
import { HousingType } from '../types/housing-type.enum.js';
import { FeatureType } from '../types/feature-type.enum.js';
import { UserType } from '../types/user-type.enum.js';

export const prepareToConsole = ( row: string ): Offer => {
  const dataArray = row.replace('\n', '').split('\t');

  const [
    title, description, date, cityName, cityLat, cityLong,
    previewImage, photos, isPremium, isFavorite, rating,
    type, rooms, guests, price, features, hostFirstName,
    hostLastName, hostEmail, hostAvatar, hostPassword,
    hostType, commentsAmount, locationLat, locationLong,
  ] = dataArray;

  return {
    title,
    description,
    createdAt: new Date(date),
    city: {
      name: cityName,
      location: {
        latitude: parseFloat(cityLat),
        longitude: parseFloat(cityLong),
      },
    },
    previewImage,
    photos: photos.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: type as HousingType,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseFloat(price),
    features: features.split(';').map(( feature ) => feature as FeatureType),
    host: {
      name: [hostFirstName, hostLastName].join(' '),
      email: hostEmail,
      avatar: hostAvatar,
      password: hostPassword,
      type: hostType as UserType,
    },
    commentsAmount: parseInt(commentsAmount, 10),
    location: {
      latitude: parseFloat(locationLat),
      longitude: parseFloat(locationLong),
    },
  };
};
