import { UserType } from '../utils.dto.js';

export default class CreateUserDto {
  public email!: string;

  public userName!: string;

  public password!: string;

  public userType!: UserType;
}
