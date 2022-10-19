import { Expose } from 'class-transformer';
import { UserType } from '../../../types/user-type.enum.js';

export default class LoginUserResponse {
  @Expose() public id!: string;

  @Expose() public token!: string;

  @Expose() public email!: string;

  @Expose() public avatar!: string;

  @Expose() public userType!: UserType;
}
