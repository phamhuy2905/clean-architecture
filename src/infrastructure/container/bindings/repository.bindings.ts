import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { InMemoryUserRepository } from '../../repositories/memory/InMemoryUserRepository';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';

/**
 * Repository bindings for dependency injection
 */
export const repositoryBindings = new ContainerModule((options) => {
    const { bind } = options;

    // Environment-based repository binding
    const environment = process.env.NODE_ENV || 'development';

    if (environment === 'test') {
        bind<IUserRepository>(TYPES.UserRepository)
            .to(InMemoryUserRepository)
            .inSingletonScope();
    } else {
        bind<IUserRepository>(TYPES.UserRepository)
            .to(PrismaUserRepository)
            .inSingletonScope();
    }
});

/**
 * Test-specific repository bindings
 * Use this in your test setup to override production bindings
 */
export const testRepositoryBindings = new ContainerModule((options) => {
    const { bind } = options;

    bind<IUserRepository>(TYPES.UserRepository)
        .to(InMemoryUserRepository)
        .inSingletonScope();
});
