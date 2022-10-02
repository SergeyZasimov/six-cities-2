import { OfferServiceInterface } from './offer-sevice.interface.js';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {
  }

  public async create( dto: CreateOfferDto ): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById( offerId: string ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('userId');
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    const result = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields:
            {
              id: { $toString: '$_id' },
              commentCount: { $size: '$comments' },
              rating: {
                $cond: [
                  { $eq: [{ $size: '$comments' }, 0] },
                  0,
                  { $round: [{ $divide: [{ $sum: '$comments.rating' }, { $size: '$comments' }] }, 1] },
                ],
              },
            },
        },
        { $unset: 'comments' },
        { $limit: DEFAULT_OFFER_COUNT },
        { $sort: { createdAt: SortType.Down } },
      ]);

    await this.offerModel.populate(result, { path: 'userId' });

    return result;
  }

  public async updateById( offerId: string, dto: UpdateOfferDto ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('userId');
  }

  public async deleteById( offerId: string ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId);
  }

  public async findPremiumByCity( city: string ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ 'city.name': city, isPremium: true }).populate('userId');
  }
}
