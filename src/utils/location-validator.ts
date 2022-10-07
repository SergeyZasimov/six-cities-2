import { isLatitude, isLongitude, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Location } from '../types/location.type.js';

@ValidatorConstraint({ name: 'Invalid Location', async: false })
export default class LocationValidator implements ValidatorConstraintInterface {
  validate( location: Location ) {
    return isLongitude(location.longitude.toString()) && isLatitude(location.latitude.toString());
  }
}
