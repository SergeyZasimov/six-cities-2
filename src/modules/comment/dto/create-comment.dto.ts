import { IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { COMMENT_CONSTRAINT } from '../comment.constant.js';

const { MIN_TEXT, MAX_TEXT, MIN_RATING, MAX_RATING } = COMMENT_CONSTRAINT;

export default class CreateCommentDTO {
  @IsString({ message: 'Comment text is required' })
  @Length(MIN_TEXT, MAX_TEXT, { message: `Minimum comment text length is ${MIN_TEXT}, maximum is ${MAX_TEXT}` })
  public text!: string;

  @IsNumber({}, { message: 'Rating is required' })
  @Min(MIN_RATING, { message: `Minimum rating must be ${MIN_RATING}` })
  @Max(MAX_RATING, { message: `Maximum rating must be ${MAX_RATING}` })
  public rating!: number;

  @IsMongoId({ message: 'OfferID must be valid ID' })
  public offerId!: string;

  public userId!: string;
}
