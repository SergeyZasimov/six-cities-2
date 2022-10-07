import { OfferServiceInterface } from './offer-sevice.interface.js';
import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../services/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Types } from 'mongoose';

const lookup = {
  $lookup: {
    from: 'comments',
    let: { offerId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
      { $project: { rating: 1 } },
    ],
    as: 'comments',
  },
};

const addFields = {
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
};

const unset = { $unset: 'comments' };

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
    return result.populate('userId');
  }

  public async findById( offerId: string ): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel
      .aggregate([
        {
          $match: {
            '_id': new Types.ObjectId(offerId),
          },
        },
        lookup,
        addFields,
        unset,
      ]);
    await this.offerModel.populate(result, { path: 'userId' });
    return result[0];
  }

  public async find( limit: number ): Promise<DocumentType<OfferEntity>[]> {
    const result = await this.offerModel
      .aggregate([
        lookup,
        addFields,
        unset,
        { $limit: limit },
        { $sort: { createdAt: SortType.Down } },
      ]);

    await this.offerModel.populate(result, { path: 'userId' });

    return result;
  }

  public async updateById( offerId: string, dto: UpdateOfferDto ): Promise<DocumentType<OfferEntity> | null> {
    await this.offerModel.findByIdAndUpdate(offerId, dto).populate('userId');
    return await this.findById(offerId);
  }

  public async deleteById( offerId: string ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId);
  }

  public async findPremiumByCity( city: string ): Promise<DocumentType<OfferEntity>[]> {
    const result = await this.offerModel
      .aggregate([
        {
          $match: { 'city.name': city, 'isPremium': true },
        },
        lookup,
        addFields,
        unset,
      ]);

    await this.offerModel.populate(result, { path: 'userId' });
    return result;
  }
}
