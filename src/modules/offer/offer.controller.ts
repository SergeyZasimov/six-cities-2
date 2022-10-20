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
import { ParamsGetOffer, ParamsGetPremium, RequestQuery } from '../../types/request-params-query.type.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import { ValidateObjectIdMiddleware } from '../../services/middlewares/validate-objectId.middleware.js';
import ValidateDtoMiddleware from '../../services/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../services/middlewares/document-exists.middleware.js';
import PrivateRouteMiddleware from '../../services/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../services/config/config.interface.js';
import { UploadFileMiddleware } from '../../services/middlewares/upload-file.middleware.js';
import { AppConfig } from '../../types/config.enum.js';
import UploadOfferPreviewImageResponse from './response/upload-offer-preview-image.response.js';
import { UploadFilesArrayMiddleware } from '../../services/middlewares/upload-files-array.middleware.js';
import UpdatePreviewImageOfferDto from './dto/update-preview-image-offer.dto.js';
import UpdatePhotosOfferDto from './dto/update-photos-offer.dto.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) config: ConfigInterface,
    @inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
  ) {
    super(logger, config);
    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Post,
      handler: this.changeFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:city/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity,
    });

    this.addRoute(({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdatePreviewImageOfferDto),
        new UploadFileMiddleware(this.config.get(AppConfig.UPLOAD_DIRECTORY), 'previewImage'),
      ],
    }));

    this.addRoute(({
      path: '/:offerId/photos',
      method: HttpMethod.Post,
      handler: this.uploadPhotos,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdatePhotosOfferDto),
        new UploadFilesArrayMiddleware(this.config.get(AppConfig.UPLOAD_DIRECTORY), 'photos'),
      ],
    }));
  }

  public async index(
    req: Request<unknown, unknown, unknown, RequestQuery>,
    res: Response,
  ): Promise<void> {
    const { limit } = req.query;
    const offers = await this.offerService.find(+(limit || DEFAULT_OFFER_COUNT), req.user?.id);
    this.ok(res, fillDto(OfferResponse, offers));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const { body } = req;
    const result = await this.offerService.create({ ...body, userId: req.user.id });
    this.ok(res, fillDto(OfferResponse, result));
  }

  public async show(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {
    const { params: { offerId } } = req;
    const result = await this.offerService.findById(offerId, req.user?.id);
    this.ok(res, fillDto(OfferResponse, result));
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const { body, params: { offerId } } = req;
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

  public async getPremiumByCity(
    req: Request<core.ParamsDictionary | ParamsGetPremium>,
    res: Response,
  ): Promise<void> {
    const { params: { city } } = req;
    const result = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDto(OfferResponse, result));
  }

  private async changeFavorites( req: Request, res: Response ) {
    const { user, body } = req;
    if (body.status) {
      await this.offerService.addToFavorites(body.offerId, user.id);
    } else {
      await this.offerService.removeFromFavorites(body.offerId, user.id);
    }
    const result = await this.offerService.findById(body.offerId, user.id);
    return this.ok(res, fillDto(OfferResponse, result));
  }

  private async getFavorites( req: Request, res: Response ) {
    const result = await this.offerService.findFavorites(req.user.id);
    return this.ok(res, fillDto(OfferResponse, result));
  }

  private async uploadPreviewImage( req: Request, res: Response ): Promise<void> {
    const { offerId } = req.params;
    const uploadFile = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, uploadFile);
    this.created(res, fillDto(UploadOfferPreviewImageResponse, uploadFile));
  }

  private async uploadPhotos( req: Request, res: Response ): Promise<void> {
    const { offerId } = req.params;
    const files = [...JSON.parse(JSON.stringify(req.files))];
    const photos = files.map(( file ) => file.filename);
    const uploadFiles = { photos };
    await this.offerService.updateById(offerId, uploadFiles);
    this.created(res, photos);
  }
}
