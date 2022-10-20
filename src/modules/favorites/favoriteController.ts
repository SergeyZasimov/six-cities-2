import { Controller } from '../../services/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { ConfigInterface } from '../../services/config/config.interface.js';
import { OfferServiceInterface } from '../offer/offer-sevice.interface.js';
import { Request, Response } from 'express';
import { fillDto } from '../../utils/fill-dto.js';
import OfferResponse from '../offer/response/offer.response.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import PrivateRouteMiddleware from '../../services/middlewares/private-route.middleware.js';
import ChangeFavoriteDto from './dto/change-favorite.dto.js';
import ValidateDtoMiddleware from '../../services/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../services/middlewares/validate-objectId.middleware.js';
import { DocumentExistsMiddleware } from '../../services/middlewares/document-exists.middleware.js';
import * as core from 'express-serve-static-core';
import { ParamsGetOffer } from '../../types/request-params-query.type.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger, config);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.changeFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(ChangeFavoriteDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  private async changeFavorites(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, ChangeFavoriteDto>,
    res: Response ) {
    const { offerId } = req.params;
    const { user, body } = req;

    if (body.status) {
      await this.offerService.addToFavorites(offerId, user.id);
    } else {
      await this.offerService.removeFromFavorites(offerId, user.id);
    }
    const result = await this.offerService.findById(offerId, user.id);
    return this.ok(res, fillDto(OfferResponse, result));
  }

  private async getFavorites( req: Request, res: Response ) {
    const result = await this.offerService.findFavorites(req.user.id);
    return this.ok(res, fillDto(OfferResponse, result));
  }
}
