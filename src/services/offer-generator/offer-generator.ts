import dayjs from 'dayjs';
import { City } from '../../types/city.type.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

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

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const date = dayjs()
      .subtract(generateRandomValue(MockConfig.FIRST_WEEK_DAY, MockConfig.LAST_WEEK_DAY), 'day')
      .subtract(generateRandomValue(MockConfig.FIRST_MONTH, MockConfig.LAST_MONTH), 'month')
      .toISOString();
    const city = getRandomItem<City>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const photos = getRandomItems<string>(this.mockData.photos);
    const isPremium = Boolean(generateRandomValue(0, 1));
    const isFavorite = Boolean(generateRandomValue(0, 1));
    const rating = generateRandomValue(MockConfig.RATING_MIN, MockConfig.RATING_MAX - 1, 1);
    const type = getRandomItem<string>(this.mockData.housingTypes);
    const rooms = generateRandomValue(MockConfig.ROOMS_MIN, MockConfig.ROOMS_MAX);
    const guests = generateRandomValue(MockConfig.GUESTS_MIN, MockConfig.GUESTS_MAX);
    const price = generateRandomValue(MockConfig.PRICE_MIN, MockConfig.PRICE_MAX);
    const features = getRandomItems<string>(this.mockData.features);
    const userName = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem<string>(this.mockData.userTypes);

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

    const [firstName, lastName] = userName.split(' ');

    const {
      name: cityName,
      location: { latitude: cityLatitude, longitude: cityLongitude },
    } = city;

    return [
      title, description, date, cityName,
      cityLatitude.toString(),
      cityLongitude.toString(),
      previewImage, photos.join(';'),
      isPremium, isFavorite, rating.toString(),
      type, rooms.toString(), guests.toString(),
      price.toString(), features.join(';'),
      firstName, lastName, email, avatar,
      password, userType,
      locationLatitude, locationLongitude,
    ].join('\t');
  }
}
