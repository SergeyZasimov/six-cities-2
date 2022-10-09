import { IsEmail, IsString, Length } from 'class-validator';
import { USER_CONSTRAINT } from '../user.constant.js';

const { MIN_PASSWORD, MAX_PASSWORD } = USER_CONSTRAINT;

export default class LoginUserDto {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @IsString({ message: 'Password is required' })
  @Length(MIN_PASSWORD, MAX_PASSWORD, {
    message: `Password user name length is ${MIN_PASSWORD}, maximum is ${MAX_PASSWORD}`,
  })
  public password!: string;
}
