import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import AuthController from '../../../presentation/controller/AuthController';
import UserController from '../../../presentation/controller/UserController';

/**
 * Controller bindings for dependency injection
 */
export const controllerBindings = new ContainerModule((options) => {
    const { bind } = options;

    bind<AuthController>(TYPES.AuthController)
        .to(AuthController)
        .inSingletonScope();

    bind<UserController>(TYPES.UserController)
        .to(UserController)
        .inSingletonScope();
});
