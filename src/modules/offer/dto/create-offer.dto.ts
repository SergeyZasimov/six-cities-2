import { City } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { Location } from '../../../types/location.type.js';
import { LocationValidator, CityValidator } from '../../../utils/custom-validators.js';

export default class CreateOfferDto {
  @MinLength(10, { message: 'Minimum title length must be 10' })
  @MaxLength(100, { message: 'Maximum title length must be 100' })
  public title!: string;

  @MinLength(20, { message: 'Minimum description length must be 20' })
  @MaxLength(1024, { message: 'Maximum description length must be 1024' })
  public description!: string;

  @Validate(CityValidator, { message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf' })
  public city!: City;

  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Photo must be jpg or png' })
  public previewImage!: string;

  @IsArray({ message: 'Photos must be an array' })
  @ArrayMinSize(6, { message: 'Photos must be 6' })
  @ArrayMaxSize(6, { message: 'Photos must be 6' })
  @Matches(/[\w/-]+.(jpg|png)/, { each: true, message: 'Photo must be jpg or png' })
  public photos!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: 'Type must be Apartment, House, Room or Hotel' })
  public type!: HousingType;

  @IsInt({ message: 'Rooms must be an integer' })
  @Min(1, { message: 'Minimum is 1 room' })
  @Max(8, { message: 'Maximum is 8 rooms' })
  public rooms!: number;

  @IsInt({ message: 'Guests must be an integer' })
  @Min(1, { message: 'Minimum is 1 guest' })
  @Max(10, { message: 'Maximum is 10 guests' })
  public guests!: number;

  @IsInt({ message: 'Guests must be an integer' })
  @Min(100, { message: 'Minimum price is 100' })
  @Max(100000, { message: 'Maximum price is 100000' })
  public price!: number;

  @IsArray({ message: 'Features must be an array' })
  @IsEnum(FeatureType, { each: true, message: 'Features must be from suggested list' })
  public features!: FeatureType[];

  @IsMongoId({ message: 'UserID must be valid ID' })
  public userId!: string;

  @Validate(LocationValidator, { message: 'Invalid location value' })
  public location!: Location;
}
