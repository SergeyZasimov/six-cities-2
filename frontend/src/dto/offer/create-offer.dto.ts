import { City, HousingType, Location } from '../utils.dto.js';


export default class CreateOfferDto {
  public title!: string;

  public description!: string;

  public city!: City;

  public isPremium!: boolean;

  public type!: HousingType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: string[];

  public location!: Location;
}
