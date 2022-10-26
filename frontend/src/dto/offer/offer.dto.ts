import { City, HousingType, Location } from '../utils.dto.js';
import UserDto from '../user/user.dto.js';

export default class OfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public city!: City;

  public previewImage!: string;

  public photos!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public type!: HousingType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: string[];

  public user!: UserDto;

  public location!: Location;

  public rating!: number;

  public commentCount!: number;
}
