import { Controller } from '../../services/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { Request, Response } from 'express';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-sevice.interface.js';
import { fillDto } from '../../utils/fill-dto.js';
import OfferResponse from './response/offer.response.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../services/errors/http-error.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CategoryController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index( _req: Request, res: Response ): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDto(OfferResponse, offers));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response ): Promise<void> {

    const existOffer = await this.offerService.findByTitle(body.title);

    if (existOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with title ${body.title} exists.`,
        'OfferController',
      );
    }

    const result = await this.offerService.create(body);
    this.ok(res, fillDto(OfferResponse, result));
  }
}
