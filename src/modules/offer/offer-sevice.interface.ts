import CreateOfferDto from './dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create( dto: CreateOfferDto ): Promise<DocumentType<OfferEntity>>;

  findById( offerId: string ): Promise<DocumentType<OfferEntity> | null>;

  find(): Promise<DocumentType<OfferEntity>[]>;

  findByTitle(offerTitle: string): Promise<DocumentType<OfferEntity> | null>;

  deleteById( offerId: string ): Promise<DocumentType<OfferEntity> | null>;

  updateById( offerId: string, dto: UpdateOfferDto ): Promise<DocumentType<OfferEntity> | null>;

  findPremiumByCity( city: string ): Promise<DocumentType<OfferEntity>[]>;

}
