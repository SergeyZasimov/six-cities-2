import { City } from '../../../types/city.type.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { FeatureType } from '../../../types/feature-type.enum.js';
import { Location } from '../../../types/location.type.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: City;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public type!: HousingType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public features!: FeatureType[];
  public userId!: string;
  public location!: Location;
}
