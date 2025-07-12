import { TAppRouter } from '../../shared/common/types/base';
import { container } from '../../infrastructure/container/container';
import { TYPES } from '../../infrastructure/container/types';
import UserController from '../controller/UserController';

const userController = container.get<UserController>(TYPES.UserController);

const userRouter: TAppRouter = {
    getProfile: {
        method: 'GET',
        handler: userController.getProfile.bind(userController),
    },
};

export default userRouter;