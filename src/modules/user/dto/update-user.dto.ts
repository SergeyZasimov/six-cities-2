import { Matches } from 'class-validator';

export default class UpdateUserDto {
  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Avatar must be jpg or png' })
  public avatar?: string;
}
