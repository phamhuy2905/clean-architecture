import bcrypt from 'bcrypt';
import { injectable } from 'inversify';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';

@injectable()
export default class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 12) {
        this.saltRounds = saltRounds;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        if (!password || !hashedPassword) {
            return false;
        }

        return await bcrypt.compare(password, hashedPassword);
    }

}
