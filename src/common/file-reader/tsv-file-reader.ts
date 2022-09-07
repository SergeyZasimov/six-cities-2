import { readFileSync } from 'fs';
import { FeatureType } from '../../types/feature-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { UserType } from '../../types/user-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public prepareToConsole(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map((item) => this.convertData(item));
  }

  private convertData = (dataArray: string[]): Offer => {
    const [
      title,
      description,
      date,
      cityName,
      cityLat,
      cityLong,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features,
      hostName,
      hostEmail,
      hostAvatar,
      hostPassword,
      hostType,
      commentsAmount,
      locationLat,
      locationLong,
    ] = dataArray;

    return {
      title,
      description,
      createdAt: new Date(date),
      city: {
        name: cityName,
        location: {
          latitude: parseFloat(cityLat),
          longitude: parseFloat(cityLong),
        },
      },
      previewImage,
      photos: photos.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: parseFloat(rating),
      type: type as HousingType,
      rooms: parseInt(rooms, 10),
      guests: parseInt(guests, 10),
      price: parseFloat(price),
      features: features.split(';').map((feature) => feature as FeatureType),
      host: {
        name: hostName,
        email: hostEmail,
        avatar: hostAvatar,
        password: hostPassword,
        type: hostType as UserType,
      },
      commentsAmount: parseInt(commentsAmount, 10),
      location: {
        latitude: parseFloat(locationLat),
        longitude: parseFloat(locationLong),
      },
    };
  };
}
