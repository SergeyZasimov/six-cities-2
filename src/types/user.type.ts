import { UserType } from './user-type.enum.js';

export type User = {
  userName: string;
  email: string;
  avatar: string;
  userType: UserType;
};
