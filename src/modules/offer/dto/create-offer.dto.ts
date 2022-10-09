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
import { OFFER_CONSTRAINT } from '../offer.constant.js';

const {
  MAX_TITLE,
  MIN_TITLE,
  MAX_DESCRIPTION,
  MIN_DESCRIPTION,
  PHOTOS_LENGTH,
  MAX_ROOMS,
  MIN_ROOMS,
  MAX_GUESTS,
  MIN_GUESTS,
  MAX_PRICE,
  MIN_PRICE,
} = OFFER_CONSTRAINT;

export default class CreateOfferDto {
  @MinLength(MIN_TITLE, { message: `Minimum title length must be ${MIN_TITLE}` })
  @MaxLength(MAX_TITLE, { message: `Maximum title length must be ${MAX_TITLE}` })
  public title!: string;

  @MinLength(MIN_DESCRIPTION, { message: `Minimum description length must be ${MIN_DESCRIPTION}` })
  @MaxLength(MAX_DESCRIPTION, { message: `Maximum description length must be ${MAX_DESCRIPTION}` })
  public description!: string;

  @Validate(CityValidator, { message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf' })
  public city!: City;

  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Photo must be jpg or png' })
  public previewImage!: string;

  @IsArray({ message: 'Photos must be an array' })
  @ArrayMinSize(PHOTOS_LENGTH, { message: `Photos must be ${PHOTOS_LENGTH}` })
  @ArrayMaxSize(PHOTOS_LENGTH, { message: `Photos must be ${PHOTOS_LENGTH}` })
  @Matches(/[\w/-]+.(jpg|png)/, { each: true, message: 'Photo must be jpg or png' })
  public photos!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: 'Type must be Apartment, House, Room or Hotel' })
  public type!: HousingType;

  @IsInt({ message: 'Rooms must be an integer' })
  @Min(MIN_ROOMS, { message: `Minimum is ${MIN_ROOMS} room` })
  @Max(MAX_ROOMS, { message: `Maximum is ${MAX_ROOMS} rooms` })
  public rooms!: number;

  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_GUESTS, { message: `Minimum is ${MIN_GUESTS} guest` })
  @Max(MAX_GUESTS, { message: `Maximum is ${MAX_GUESTS} guests` })
  public guests!: number;

  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_PRICE, { message: `Minimum price is ${MIN_PRICE}` })
  @Max(MAX_PRICE, { message: `Maximum price is ${MAX_PRICE}` })
  public price!: number;

  @IsArray({ message: 'Features must be an array' })
  @IsEnum(FeatureType, { each: true, message: 'Features must be from suggested list' })
  public features!: FeatureType[];

  @IsMongoId({ message: 'UserID must be valid ID' })
  public userId!: string;

  @Validate(LocationValidator, { message: 'Invalid location value' })
  public location!: Location;
}
