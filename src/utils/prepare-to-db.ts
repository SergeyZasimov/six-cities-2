import { Offer } from '../types/offer.type.js';
import { HousingType } from '../types/housing-type.enum.js';
import { FeatureType } from '../types/feature-type.enum.js';
import { UserType } from '../types/user-type.enum.js';
import { Comment } from '../types/comment.type.js';

const parseComments = ( comments: string ): Comment[] | [] => {
  if (comments.trim()) {
    return comments.split(';').map(( comment ): Comment => {
      const [text, rating, userName, email, avatar, userType] = comment.split('=');
      return {
        text,
        rating: parseFloat(rating),
        user: { userName, email, avatar, userType: userType as UserType },
      };
    });
  }
  return [];
};

export const prepareToDb = ( row: string ): Offer => {
  const dataArray = row.replace('\n', '').split('\t');

  const [
    title, description, cityName, cityLat, cityLong,
    previewImage, photos, isPremium,
    type, rooms, guests, price, features, hostName, hostEmail, hostAvatar, hostType,
    locationLat, locationLong, comments,
  ] = dataArray;

  return {
    title,
    description,
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
    type: type as HousingType,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseFloat(price),
    features: features.split(';').map(( feature ) => feature as FeatureType),
    user: {
      userName: hostName,
      email: hostEmail,
      avatar: hostAvatar,
      userType: hostType as UserType,
    },
    location: {
      latitude: parseFloat(locationLat),
      longitude: parseFloat(locationLong),
    },
    comments: parseComments(comments),
  };
};
