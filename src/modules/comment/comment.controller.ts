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

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDTO)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async create(
    req: Request<unknown, unknown, CreateCommentDTO>,
    res: Response,
  ): Promise<void> {
    const { body } = req;

    if (!await this.offerService.findById(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID: ${body.offerId} - not found`,
        'CommentOffer',
      );
    }

    const result = this.commentService.create(body);
    this.created(res, fillDto(CommentResponse, result));
  }

  public async getComments(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {

    const { params: { offerId } } = req;

    if (!await this.offerService.findById(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID: ${offerId} - not found`,
        'CommentOffer',
      );
    }

    const result = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDto(CommentResponse, result));
  }

}
