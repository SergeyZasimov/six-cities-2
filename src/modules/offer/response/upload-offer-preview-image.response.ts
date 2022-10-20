import { Expose } from 'class-transformer';

export default class UploadOfferPreviewImageResponse {
  @Expose() public previewImage!: string;
}
