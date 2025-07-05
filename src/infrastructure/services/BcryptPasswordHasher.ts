import bcrypt from 'bcrypt';
import { injectable } from 'inversify';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';

/**
 * Bcrypt implementation of password hasher
 * Belongs to Infrastructure layer
 */
@injectable()
export default class BcryptPasswordHasher implements IPasswordHasher {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 12) {
        this.saltRounds = saltRounds;
    }

    async hash(password: string): Promise<string> {
        if (!password || password.trim().length === 0) {
            throw new Error("Password cannot be empty");
        }

        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        if (!password || !hashedPassword) {
            return false;
        }

        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error(`Failed to compare passwords: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateStrength(password: string): Promise<{ isValid: boolean; errors: string[]; }> {
        const errors: string[] = [];

        if (!password) {
            errors.push("Password is required");
            return { isValid: false, errors };
        }

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }

        if (!/(?=.*[a-z])/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }

        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (!/(?=.*\d)/.test(password)) {
            errors.push("Password must contain at least one number");
        }

        if (!/(?=.*[@$!%*?&])/.test(password)) {
            errors.push("Password must contain at least one special character (@$!%*?&)");
        }

        return { isValid: errors.length === 0, errors };
    }
}
