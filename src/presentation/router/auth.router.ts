import { registerUserSchema } from '../validation/auth/registerUserSchema';
import { TAppRouter } from '../../shared/common/types/base';
import { container } from '../../infrastructure/container/container';
import { TYPES } from '../../infrastructure/container/types';
import AuthController from '../controller/AuthController';
import { loginUserSchema } from '../validation/auth/loginUserSchema';
import { bindMethods } from '../../shared/helper/base';

const authController = bindMethods(container.get<AuthController>(TYPES.AuthController));

const authRouter: TAppRouter = {
    register: {
        method: 'POST',
        validator: registerUserSchema,
        handler: authController.register,
    },
    login: {
        method: 'POST',
        validator: loginUserSchema,
        handler: authController.login,
    },
};

export default authRouter;