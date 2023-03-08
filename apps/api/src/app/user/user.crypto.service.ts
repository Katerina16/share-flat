import { createHash } from 'crypto';

export class UserCryptoService {
  public static encrypt(password): string {
    return createHash('sha256').update(createHash('md5').update(password).digest('hex')).digest('hex');
  }
}
