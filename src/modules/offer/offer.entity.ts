import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { FeatureType } from '../../types/feature-type.enum.js';
import { Location } from '../../types/location.type.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({ required: true, minlength: 10, maxlength: 100 })
  public title!: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: true })
  public type!: HousingType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public features!: FeatureType[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, allowMixed: Severity.ALLOW })
  public location!: Location;

  @prop({ ref: UserEntity, default: [] })
  public favorites!: Ref<UserEntity>[];
}

export const OfferModel = getModelForClass(OfferEntity);
