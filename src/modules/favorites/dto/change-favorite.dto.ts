import { IsIn, IsInt } from 'class-validator';

export default class ChangeFavoriteDto {
  @IsInt({ message: 'Status is required' })
  @IsIn([0, 1])
  public status!: number;
}
