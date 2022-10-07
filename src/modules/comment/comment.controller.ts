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

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
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

}
