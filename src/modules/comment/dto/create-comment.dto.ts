import { IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export default class CreateCommentDTO {

  @IsString({ message: 'Comment text is required' })
  @Length(5, 1024, { message: 'Minimum comment text length is 5, maximum is 1024' })
  public text!: string;

  @IsNumber({}, { message: 'Rating is required' })
  @Min(1, { message: 'Minimum rating must be 1' })
  @Max(5, { message: 'Maximum rating must be 5' })
  public rating!: number;

  @IsMongoId({ message: 'OfferID must be valid ID' })
  public offerId!: string;

  @IsMongoId({ message: 'UserID must be valid ID' })
  public userId!: string;
}
