import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  public email!: string;
  public avatar!: string;
  public name!: string;
  public password!: string;
  public type!: UserType;
}