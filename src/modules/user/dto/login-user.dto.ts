import { IsEmail, IsString, Length } from 'class-validator';

export default class LoginUserDto {
  @IsString({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid email address' })
  public email!: string;

  @IsString({ message: 'Password is required' })
  @Length(6, 12, { message: 'Password user name length is 6, maximum is 12' })
  public password!: string;
}
