import * as core from 'express-serve-static-core';
import { Controller } from '../../services/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-sevice.interface.js';
import { Request, Response } from 'express';
import CreateCommentDTO from './dto/create-comment.dto.js';
import HttpError from '../../services/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDto } from '../../utils/fill-dto.js';
import CommentResponse from './response/comment.response.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { ParamsGetOffer } from '../../types/request-params-query.type.js';
import { ValidateObjectIdMiddleware } from '../../services/middlewares/validate-objectId.middleware.js';
import ValidateDtoMiddleware from '../../services/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../services/middlewares/document-exists.middleware.js';
import PrivateRouteMiddleware from '../../services/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../services/config/config.interface.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger, config);

    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDTO),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create( req: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDTO>, res: Response ): Promise<void> {
    const { body } = req;
    if (!(await this.offerService.exists(body.offerId))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with ID: ${body.offerId} - not found`, 'CommentOffer');
    }

    await this.commentService.create({ ...body, userId: req.user.id });
    const result = await this.commentService.findByOfferId(body.offerId);
    this.created(res, fillDto(CommentResponse, result));
  }

  public async getComments( req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response ): Promise<void> {
    const {
      params: { offerId },
    } = req;
    const result = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDto(CommentResponse, result));
  }
}
