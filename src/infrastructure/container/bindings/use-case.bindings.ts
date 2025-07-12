import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import RegisterUserUseCase from '../../../application/use-case/auth/RegisterUserUseCase';
import LoginUserUseCase from '../../../application/use-case/auth/LoginUserUseCase';
import GetProfileUseCase from '../../../application/use-case/user/GetProfileUseCase';

/**
 * Use case bindings for dependency injection
 */
export const useCaseBindings = new ContainerModule((options) => {
    const { bind } = options;

    bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase)
        .to(RegisterUserUseCase)
        .inSingletonScope();

    bind<LoginUserUseCase>(TYPES.LoginUserUseCase)
        .to(LoginUserUseCase)
        .inSingletonScope();

    bind<GetProfileUseCase>(TYPES.GetProfileUseCase)
        .to(GetProfileUseCase)
        .inSingletonScope();

});
