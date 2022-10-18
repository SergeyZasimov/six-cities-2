export const USER_CONSTRAINT = {
  MIN_USERNAME: 1,
  MAX_USERNAME: 15,
  MIN_PASSWORD: 6,
  MAX_PASSWORD: 12,
} as const;

export const JWT_ALGORITHM = 'HS256';

export const DEFAULT_AVATAR_IMAGE = 'default-avatar.svg';
