import * as core from 'express-serve-static-core';
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
import UpdateOfferDto from './dto/update-offer.dto.js';
import HttpError from '../../services/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

type ParamsGetOffer = {
  offerId: string;
}

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
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index( _req: Request, res: Response ): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDto(OfferResponse, offers));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response ): Promise<void> {

    const { body } = req;
    const result = await this.offerService.create(body);
    this.ok(res, fillDto(OfferResponse, result));
  }

  public async show(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {

    const { params: { offerId } } = req;

    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID: ${offerId} - not found`,
        'OfferController',
      );
    }

    const result = await this.offerService.findById(offerId);
    this.ok(res, fillDto(OfferResponse, result));
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {

    const { body, params: { offerId } } = req;

    const existOffer = await this.offerService.findById(offerId);

    if (!existOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with ID: ${offerId} - not found`,
        'OfferController',
      );
    }

    const result = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDto(OfferResponse, result));
  }

  public async delete(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {

    const { params: { offerId } } = req;
    await this.offerService.deleteById(offerId);
    this.noContent(res);
  }
}
