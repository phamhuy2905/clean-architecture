import { injectable, inject } from 'inversify';
import User from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/services/IPasswordHasher";
import { TYPES } from "../../../infrastructure/container/types";
import { APIException, AppGlobalError } from '../../../shared/exception/base';
import { Responsibility } from '../../../shared/common/responsibility';
import { AppMessage } from '../../../shared/common/appMessage';


export interface ILoginUserRequest {
    email: string;
    password: string;
}

@injectable()
export default class LoginUserUseCase {
    private userRepository: IUserRepository;
    private passwordHasher: IPasswordHasher;

    constructor(
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.PasswordHasher) passwordHasher: IPasswordHasher
    ) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public async execute(request: ILoginUserRequest): Promise<User> {
        const { email, password } = request;

        // Check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new APIException(
                Responsibility.CLIENT_NOT_FOUND,
                AppMessage.API_E_003,
                [new AppGlobalError("API_E_005", AppMessage.API_E_005)],
            );
        }

        // Verify password
        const isPasswordValid = this.passwordHasher.compare(password, user.getPassword());
        if (!isPasswordValid) {
            throw new APIException(
                Responsibility.UNAUTHORIZED,
                AppMessage.API_E_004,
                [new AppGlobalError("API_E_004", AppMessage.API_E_004)],
            );
        }

        return user;
    }

}