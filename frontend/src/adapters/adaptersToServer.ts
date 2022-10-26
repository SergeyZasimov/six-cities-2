import { NewOffer, UserRegister } from '../types/types';
import CreateUserDto from '../dto/user/create-user.dto';
import { UserType } from '../dto/utils.dto';
import CreateOfferDto from '../dto/offer/create-offer.dto';
import CreateCommentDto from '../dto/comment/create-comment.dto';

export const adaptRegisterToServer = ( user: UserRegister ): CreateUserDto => ({
  userName: user.name,
  email: user.email,
  password: user.password,
  userType: user.isPro ? UserType.Pro : UserType.Default,
});


export const adaptNewOfferToServer = ( offer: NewOffer ): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city,
  isPremium: offer.isPremium,
  type: offer.type,
  rooms: offer.bedrooms,
  guests: offer.maxAdults,
  price: offer.price,
  features: offer.goods,
  location: offer.location,
});

export const adaptNewCommentToServer = ( comment: { comment: string, rating: number, id: string } ): CreateCommentDto => ({
  text: comment.comment,
  offerId: comment.id,
  rating: comment.rating,
});
