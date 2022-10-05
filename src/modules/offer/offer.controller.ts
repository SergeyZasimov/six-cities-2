import { Controller } from '../../services/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import { Request, Response } from 'express';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-sevice.interface.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for CategoryController');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async index( _req: Request, res: Response ): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, offers);
  }

  public create( _req: Request, _res: Response ): void {
  }
}
