import { Expose, Type } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { Location } from '../../../types/location.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferResponse {
  @Expose() public id!: string;

  @Expose() public title!: string;

  @Expose() public description!: string;

  @Expose() public city!: City;

  @Expose() public previewImage!: string;

  @Expose() public photos!: string[];

  @Expose() public isPremium!: boolean;

  @Expose() public isFavorite!: boolean;

  @Expose() public type!: HousingType;

  @Expose() public rooms!: number;

  @Expose() public guests!: number;

  @Expose() public price!: number;

  @Expose() public features!: FeatureType;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose() public location!: Location;

  @Expose() public commentCount!: number;

  @Expose() public rating!: number;
}
