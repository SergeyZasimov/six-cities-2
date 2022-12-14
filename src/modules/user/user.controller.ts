import { Controller } from '../../services/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { UserServiceInterface } from './user-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import { fillDto } from '../../utils/fill-dto.js';
import UserResponse from './response/user.response.js';
import HttpError from '../../services/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import LoginUserDto from './dto/login-user.dto.js';
import ValidateDtoMiddleware from '../../services/middlewares/validate-dto.middleware.js';
import { UploadFileMiddleware } from '../../services/middlewares/upload-file.middleware.js';
import { ConfigInterface } from '../../services/config/config.interface.js';
import { AppConfig } from '../../types/config.enum.js';
import { createJwt } from '../../utils/create-jwt.js';
import { JWT_ALGORITHM } from './user.constant.js';
import LoginUserResponse from './response/login-user.response.js';
import PrivateRouteMiddleware from '../../services/middlewares/private-route.middleware.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';
import UpdateOfferDto from '../offer/dto/update-offer.dto.js';
import * as core from 'express-serve-static-core';
import { ParamsGetUser } from '../../types/request-params-query.type.js';
import { ValidateObjectIdMiddleware } from '../../services/middlewares/validate-objectId.middleware.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger, config);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFileMiddleware(this.config.get(AppConfig.UPLOAD_DIRECTORY), 'avatar'),
      ],
    });
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const { body } = req;
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} exists`,
        'UserController',
      );
    }

    const result = await this.userService.create(body);

    this.created(res, fillDto(UserResponse, result));
  }

  public async login(
    req: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const { body } = req;
    const user = await this.userService.verifyUser(body);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Not_found',
        'UserController',
      );
    }

    const token = await createJwt(
      JWT_ALGORITHM,
      this.config.get(AppConfig.JWT_SECRET),
      { email: user.email, id: user.id },
    );

    this.ok(res, fillDto(LoginUserResponse, { token }));
  }

  private async logout( _req: Request, res: Response ): Promise<void> {
    this.noContent(res);
  }

  private async uploadAvatar(
    req: Request<core.ParamsDictionary | ParamsGetUser>,
    res: Response,
  ): Promise<void> {
    const { userId } = req.params;
    const uploadFile = { avatar: req.file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDto(UploadUserAvatarResponse, uploadFile));
  }

  private async checkAuthenticate( req: Request, res: Response ): Promise<void> {
    const result = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDto(UserResponse, result));
  }
}
