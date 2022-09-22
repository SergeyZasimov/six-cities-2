import { User } from '../../types/user.type.js';
import { UserType } from '../../types/user-type.enum.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createPasswordHash } from '../../utils/create-password-hash.js';

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

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.type = data.type;
  }

  @prop({ required: true, minLength: 1, maxLength: 15 })
  public name!: string;

  @prop({ unique: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'] })
  public email!: string;

  @prop({ match: [/^[\w+/]+.(png|jpg)$/, 'The image must be in the format .png or .jpg'] })
  public avatar!: string;

  @prop({ minLength: 6, maxLength: 12, default: '' })
  private password!: string;

  @prop()
  public type!: UserType;

  public async setPassword( password: string, salt: string ): Promise<void> {
    this.password = await createPasswordHash(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
