import { ArrayMaxSize, ArrayMinSize, IsArray, Matches } from 'class-validator';
import { OFFER_CONSTRAINT } from '../offer.constant.js';

const { PHOTOS_LENGTH } = OFFER_CONSTRAINT;


export default class UpdatePhotosOfferDto {
  @IsArray({ message: 'Photos must be an array' })
  @ArrayMinSize(PHOTOS_LENGTH, { message: `Photos must be ${PHOTOS_LENGTH}` })
  @ArrayMaxSize(PHOTOS_LENGTH, { message: `Photos must be ${PHOTOS_LENGTH}` })
  @Matches(/[\w/-]+.(jpg|png)/, { each: true, message: 'Photo must be jpg or png' })
  public photos?: string[];
}
