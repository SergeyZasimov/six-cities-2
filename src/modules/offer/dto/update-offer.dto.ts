import { City } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { Location } from '../../../types/location.type.js';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { CityValidator, LocationValidator } from '../../../utils/custom-validators.js';
import { OFFER_CONSTRAINT } from '../offer.constant.js';

const {
  MAX_TITLE,
  MIN_TITLE,
  MAX_DESCRIPTION,
  MIN_DESCRIPTION,
  MAX_ROOMS,
  MIN_ROOMS,
  MAX_GUESTS,
  MIN_GUESTS,
  MAX_PRICE,
  MIN_PRICE,
} = OFFER_CONSTRAINT;

export default class UpdateOfferDto {
  @ValidateIf(( obj ) => Boolean(obj.title))
  @MinLength(MIN_TITLE, { message: `Minimum title length must be ${MIN_TITLE}` })
  @MaxLength(MAX_TITLE, { message: `Maximum title length must be ${MAX_TITLE}` })
  public title?: string;

  @ValidateIf(( obj ) => Boolean(obj.description))
  @MinLength(MIN_DESCRIPTION, { message: `Minimum description length must be ${MIN_DESCRIPTION}` })
  @MaxLength(MAX_DESCRIPTION, { message: `Maximum description length must be ${MAX_DESCRIPTION}` })
  public description?: string;

  @ValidateIf(( obj ) => Boolean(obj.city))
  @Validate(CityValidator, { message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf' })
  public city?: City;

  @ValidateIf(( obj ) => Boolean(obj.previewImage))
  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Photo must be jpg or png' })
  public previewImage?: string;

  @ValidateIf(( obj ) => Boolean(obj.photos))
  @IsArray({ message: 'Photos must be an array' })
  @Matches(/[\w/-]+.(jpg|png)/, { each: true, message: 'Photo must be jpg or png' })
  public photos?: string[];

  @ValidateIf(( obj ) => Boolean(obj.isPremium))
  @IsBoolean()
  public isPremium?: boolean;

  @ValidateIf(( obj ) => Boolean(obj.type))
  @IsEnum(HousingType, { message: 'Type must be Apartment, House, Room or Hotel' })
  public type?: HousingType;

  @ValidateIf(( obj ) => Boolean(obj.rooms))
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(MIN_ROOMS, { message: `Minimum is ${MIN_ROOMS} room` })
  @Max(MAX_ROOMS, { message: `Maximum is ${MAX_ROOMS} rooms` })
  public rooms?: number;

  @ValidateIf(( obj ) => Boolean(obj.guests))
  @IsInt({ message: 'Guests must be an integer' })
  @Min(MIN_GUESTS, { message: `Minimum is ${MIN_GUESTS} guest` })
  @Max(MAX_GUESTS, { message: `Maximum is ${MAX_GUESTS} guests` })
  public guests?: number;

  @ValidateIf(( obj ) => Boolean(obj.price))
  @IsInt({ message: 'Price must be an integer' })
  @Min(MIN_PRICE, { message: `Minimum price is ${MIN_PRICE}` })
  @Max(MAX_PRICE, { message: `Maximum price is ${MAX_PRICE}` })
  public price?: number;

  @ValidateIf(( obj ) => Boolean(obj.features))
  @IsArray({ message: 'Features must be an array' })
  @IsEnum(FeatureType, { each: true, message: 'Features must be from suggested list' })
  public features?: FeatureType[];

  @ValidateIf(( obj ) => Boolean(obj.location))
  @Validate(LocationValidator, { message: 'Invalid location value' })
  public location?: Location;
}
