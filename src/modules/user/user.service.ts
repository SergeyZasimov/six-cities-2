import { UserServiceInterface } from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { ConfigInterface } from '../../services/config/config.interface.js';
import { AppConfig } from '../../types/config.enum.js';
import LoginUserDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { DEFAULT_AVATAR_IMAGE } from './user.constant.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface,
  ) {
  }

  public async create( dto: CreateUserDto ): Promise<DocumentType<UserEntity>> {
    const salt = this.config.get(AppConfig.SALT);
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_IMAGE});
    await user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail( email: string ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate( dto: CreateUserDto ): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public async verifyUser( dto: LoginUserDto ): Promise<DocumentType<UserEntity> | null> {
    const { email, password } = dto;

    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    if (await user.verifyPassword(password)) {
      return user;
    }

    return null;
  }

  public async updateById( userId: string, dto: UpdateUserDto ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true });
  }
}
