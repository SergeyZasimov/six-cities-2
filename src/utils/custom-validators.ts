import { isLatitude, isLongitude, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Location } from '../types/location.type.js';
import { City } from '../types/city.type.js';
import { Cities } from '../types/cities.enum.js';
import { isDeepStrictEqual } from 'util';

@ValidatorConstraint({ name: 'Invalid Location', async: false })
export class LocationValidator implements ValidatorConstraintInterface {
  validate( location: Location ) {
    return isLongitude(location.longitude.toString()) && isLatitude(location.latitude.toString());
  }
}

@ValidatorConstraint({ name: 'Invalid City', async: false })
export class CityValidator implements ValidatorConstraintInterface {
  validate( city: City ) {
    const cities = Object.values(Cities);
    const templateCity = cities.find(( item ) => item.name === city.name);
    if (!templateCity) {
      return false;
    }
    return isDeepStrictEqual(city, templateCity);
  }
}
