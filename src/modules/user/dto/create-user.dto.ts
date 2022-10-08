import { UserType } from '../../../types/user-type.enum.js';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';

export default class CreateUserDto {

  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @Matches(/[\w/-]+.(jpg|png)/, { message: 'Avatar must be jpg or png' })
  public avatar!: string;

  @IsString({ message: 'User name is required' })
  @Length(1, 15, { message: 'Minimum user name length is 1, maximum is 15' })
  public userName!: string;

  @IsString({ message: 'Password is required' })
  @Length(6, 12, { message: 'Password user name length is 6, maximum is 12' })
  public password!: string;

  @IsEnum(UserType, { message: 'User type must be Default or Pro' })
  public userType!: UserType;
}
