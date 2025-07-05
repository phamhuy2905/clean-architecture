export interface IPasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
    validateStrength?(password: string): Promise<{ isValid: boolean; errors: string[]; }>;
}
