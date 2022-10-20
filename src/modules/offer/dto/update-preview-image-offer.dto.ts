import { Matches } from 'class-validator';


export default class UpdatePreviewImageOfferDto {
  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Photo must be jpg or png' })
  public previewImage?: string;
}
