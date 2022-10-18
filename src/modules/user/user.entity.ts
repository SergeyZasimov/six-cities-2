import { User } from '../../types/user.type.js';
import { UserType } from '../../types/user-type.enum.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createPasswordHash } from '../../utils/create-password-hash.js';
import bcrypt from 'bcrypt';
import { DEFAULT_AVATAR_IMAGE } from './user.constant.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor( data: User ) {
    super();

    this.userName = data.userName;
    this.email = data.email;
    this.avatar = data.avatar || DEFAULT_AVATAR_IMAGE;
    this.userType = data.userType || UserType.Default;
  }

  @prop({ required: true, minLength: 1, maxLength: 15 })
  public userName!: string;

  @prop({ unique: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'] })
  public email!: string;

  @prop({ match: [/[\w/-]+.(jpg|png)/, 'The image must be in the format .png or .jpg'] })
  public avatar!: string;

  @prop()
  private password!: string;

  @prop()
  public userType!: UserType;

  public async setPassword( password: string, salt: string ): Promise<void> {
    this.password = await createPasswordHash(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserModel = getModelForClass(UserEntity);
