import { Expose } from 'class-transformer';

export default class LoginUserResponse {
  @Expose() public token!: string;
}
