import * as jose from 'jose';
import * as crypto from 'crypto';

export const createJwt = async ( algorithm: string, secretJwt: string, payload: object ): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(crypto.createSecretKey(secretJwt, 'utf-8'));
