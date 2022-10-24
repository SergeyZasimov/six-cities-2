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
import { ParamsGetOffer, RequestQuery } from '../../types/request-params-query.type.js';
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
import { Cities } from '../../types/cities.enum.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../services/errors/http-error.js';

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
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumByCity,
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
        new ValidateDtoMiddleware(UpdateOfferDto),
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

    this.addRoute(({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
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
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFilesArrayMiddleware(this.config.get(AppConfig.UPLOAD_DIRECTORY), 'photos'),
      ],
    }));
  }

  public async index(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, RequestQuery>,
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
    const offer = await this.offerService.create({ ...body, userId: req.user.id });
    const result = fillDto(OfferResponse, offer);
    this.ok(res, { ...result, rating: 0, commentCount: 0 });
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
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, RequestQuery>,
    res: Response,
  ): Promise<void> {
    const { city } = req.query;
    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City name is required',
        'OfferController',
      );
    }

    if (!(Object.keys(Cities).includes(city))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `"${city}" is unknown city name`,
        'OfferController',
      );
    }
    const result = await this.offerService.findPremiumByCity(city, req.user?.id);
    this.ok(res, fillDto(OfferResponse, result));
  }

  private async uploadPreviewImage(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response,
  ): Promise<void> {
    const { offerId } = req.params;
    const uploadFile = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, uploadFile);
    this.ok(res, fillDto(UploadOfferPreviewImageResponse, uploadFile));
  }

  private async uploadPhotos( req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response ): Promise<void> {
    const { offerId } = req.params;
    const files = [...JSON.parse(JSON.stringify(req.files))];
    const photos = files.map(( file ) => file.filename);
    const uploadFiles = { photos };
    await this.offerService.updateById(offerId, uploadFiles);
    this.ok(res, uploadFiles);
  }
}
