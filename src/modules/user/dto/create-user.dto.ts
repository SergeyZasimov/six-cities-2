import { UserType } from '../../../types/user-type.enum.js';
import { IsEmail, IsEnum, IsString, Length, ValidateIf } from 'class-validator';
import { USER_CONSTRAINT } from '../user.constant.js';

const { MIN_USERNAME, MAX_USERNAME, MIN_PASSWORD, MAX_PASSWORD } = USER_CONSTRAINT;

export default class CreateUserDto {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @IsString({ message: 'User name is required' })
  @Length(MIN_USERNAME, MAX_USERNAME, {
    message: `Minimum user name length is ${MIN_USERNAME}, maximum is ${MAX_USERNAME}`,
  })
  public userName!: string;

  @IsString({ message: 'Password is required' })
  @Length(MIN_PASSWORD, MAX_PASSWORD, {
    message: `Password user name length is ${MIN_PASSWORD}, maximum is ${MAX_PASSWORD}`,
  })
  public password!: string;

  @ValidateIf(( obj ) => obj.userType !== '')
  @IsEnum(UserType, { message: 'User type must be Default or Pro' })
  public userType!: UserType;
}
