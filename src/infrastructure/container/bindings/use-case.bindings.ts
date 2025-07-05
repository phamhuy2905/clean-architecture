import { ContainerModule } from 'inversify';
import { TYPES } from '../types';
import RegisterUserUseCase from '../../../application/use-case/RegisterUserUseCase';

/**
 * Use case bindings for dependency injection
 */
export const useCaseBindings = new ContainerModule((options) => {
    const { bind } = options;

    bind<RegisterUserUseCase>(TYPES.RegisterUserUseCase)
        .to(RegisterUserUseCase)
        .inSingletonScope();
});
