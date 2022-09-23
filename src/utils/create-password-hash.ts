import bcrypt from 'bcrypt';

export const createPasswordHash = async ( password: string, salt: string ): Promise<string> =>
  await bcrypt.hash(password, salt);
