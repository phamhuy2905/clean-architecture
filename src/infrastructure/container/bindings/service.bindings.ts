import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import BcryptPasswordHasher from '../../services/BcryptPasswordHasher';

/**
 * Service bindings for dependency injection
 */
export const serviceBindings = new ContainerModule((options) => {
    const { bind } = options;

    // Environment-based password hasher binding
    const environment = process.env.NODE_ENV || 'development';

    bind<IPasswordHasher>(TYPES.PasswordHasher)
        .to(BcryptPasswordHasher)
        .inSingletonScope();
});
