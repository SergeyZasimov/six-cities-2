export type City = {
  name: string;
  location: Location;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export enum UserType {
  Default = 'Default',
  Pro = 'Pro',
}

export const TYPES = ['apartment', 'room', 'house', 'hotel'] as const;

export type HousingType = typeof TYPES[number];
