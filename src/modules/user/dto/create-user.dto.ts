import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  public email!: string;
  public avatar!: string;
  public userName!: string;
  public password!: string;
  public userType!: UserType;
}
