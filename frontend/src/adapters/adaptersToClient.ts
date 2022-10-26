import OfferDto from '../dto/offer/offer.dto';
import { Comment, Offer, User } from '../types/types';
import UserDto from '../dto/user/user.dto';
import CommentDto from '../dto/comment/comment.dto';

export const adaptUserToClient = ( user: UserDto ): User => ({
  name: user.userName,
  avatarUrl: user.avatar,
  isPro: user.userType === 'Pro',
  email: user.email,
});

export const adaptOfferToClient = ( offer: OfferDto ): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: offer.city,
  location: offer.location,
  previewImage: offer.previewImage,
  type: offer.type,
  bedrooms: offer.rooms,
  description: offer.description,
  goods: offer.features,
  host: adaptUserToClient(offer.user),
  images: offer.photos,
  maxAdults: offer.guests,
});

export const adaptOffersToClient = ( offers: OfferDto[] ): Offer[] =>
  offers
    .filter(( offer: OfferDto ) => offer.user !== null)
    .map(adaptOfferToClient);

export const adaptCommentToClient = ( comment: CommentDto ): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});

export const adaptCommentsToClient = ( comments: CommentDto[] ): Comment[] => comments.map(adaptCommentToClient);
