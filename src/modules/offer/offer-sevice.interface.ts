import CreateOfferDto from './dto/create-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface{
  create( dto: CreateOfferDto ): Promise<DocumentType<OfferEntity>>;

  findById( offerId: string ): Promise<DocumentType<OfferEntity> | null>;

  find(limit:number): Promise<DocumentType<OfferEntity>[]>;

  deleteById( offerId: string ): Promise<DocumentType<OfferEntity> | null>;

  updateById( offerId: string, dto: UpdateOfferDto ): Promise<DocumentType<OfferEntity> | null>;

  findPremiumByCity( city: string ): Promise<DocumentType<OfferEntity>[]>;

}
