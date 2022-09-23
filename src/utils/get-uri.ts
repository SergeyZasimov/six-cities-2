export const getUri = (
  username: string,
  password: string,
  host: string,
  port: number,
  dbName: string,
): string => `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
