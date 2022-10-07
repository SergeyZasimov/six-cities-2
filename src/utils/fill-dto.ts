import { ClassConstructor, plainToInstance } from 'class-transformer';

export const fillDto = <T, V>( responseObject: ClassConstructor<T>, plainObject: V ) =>
  plainToInstance(responseObject, plainObject, { excludeExtraneousValues: true });
