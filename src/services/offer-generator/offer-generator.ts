import { City } from '../../types/city.type.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { User } from '../../types/user.type.js';
import { UserType } from '../../types/user-type.enum.js';

enum MockConfig {
  RATING_MIN = 1,
  RATING_MAX = 5,
  ROOMS_MIN = 1,
  ROOMS_MAX = 8,
  GUESTS_MIN = 1,
  GUESTS_MAX = 10,
  PRICE_MIN = 100,
  PRICE_MAX = 100000,
  COMMENT_MIN = 0,
  COMMENTS_MAX = 10,
  LATITUDE_MIN = 48,
  LATITUDE_MAX = 51,
  LONGITUDE_MIN = 2,
  LONGITUDE_MAX = 10,
  LOCATION_NUM_AFTER_DIGITS = 6,
  FIRST_WEEK_DAY = 1,
  LAST_WEEK_DAY = 7,
  FIRST_MONTH = 1,
  LAST_MONTH = 12,
}

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor( private readonly mockData: MockData ) {
  }

  private createUser(): User {
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem<string>(this.mockData.userTypes) as UserType;
    return { userName, email, avatar, userType };
  }

  private createComment( comment: string ): string {
    const rating = generateRandomValue(MockConfig.RATING_MIN, MockConfig.RATING_MAX, 1);
    const { userName, email, avatar, userType } = this.createUser();
    return [comment, rating, userName, email, avatar, userType].join('=');
  }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<City>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const photos = getRandomItems<string>(this.mockData.photos);
    const isPremium = Boolean(generateRandomValue(0, 1));
    const type = getRandomItem<string>(this.mockData.housingTypes);
    const rooms = generateRandomValue(MockConfig.ROOMS_MIN, MockConfig.ROOMS_MAX);
    const guests = generateRandomValue(MockConfig.GUESTS_MIN, MockConfig.GUESTS_MAX);
    const price = generateRandomValue(MockConfig.PRICE_MIN, MockConfig.PRICE_MAX);
    const features = getRandomItems<string>(this.mockData.features);
    const { userName, email, avatar, userType } = this.createUser();
    const comments = getRandomItems<string>(this.mockData.comments).map((comment) => this.createComment(comment));

    const locationLatitude = generateRandomValue(
      MockConfig.LATITUDE_MIN,
      MockConfig.LATITUDE_MAX,
      MockConfig.LOCATION_NUM_AFTER_DIGITS,
    );

    const locationLongitude = generateRandomValue(
      MockConfig.LONGITUDE_MIN,
      MockConfig.LONGITUDE_MAX,
      MockConfig.LOCATION_NUM_AFTER_DIGITS,
    );

    const {
      name: cityName,
      location: { latitude: cityLatitude, longitude: cityLongitude },
    } = city;

    return [
      title, description, cityName,
      cityLatitude.toString(),
      cityLongitude.toString(),
      previewImage, photos.join(';'),
      isPremium, type, rooms.toString(),
      guests.toString(), price.toString(), features.join(';'),
      userName, email, avatar, userType,
      locationLatitude, locationLongitude, comments.join(';'),
    ].join('\t');
  }
}
