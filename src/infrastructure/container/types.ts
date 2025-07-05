/**
 * Dependency Injection Types
 * Defines all the symbols for dependency injection
 */

// Repository Types
export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),

    // Services
    PasswordHasher: Symbol.for('PasswordHasher'),

    // Use Cases
    RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),

    // Controllers
    CreateUserController: Symbol.for('CreateUserController'),

    // External Services
    Logger: Symbol.for('Logger'),
    Database: Symbol.for('Database'),
} as const;

// Environment Types
export const ENV_TYPES = {
    Development: 'development',
    Production: 'production',
    Test: 'test',
} as const;

export type Environment = typeof ENV_TYPES[keyof typeof ENV_TYPES];
