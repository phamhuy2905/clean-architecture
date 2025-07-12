import { injectable, inject } from 'inversify';
import User from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/services/IPasswordHasher";
import { TYPES } from "../../../infrastructure/container/types";
import { APIException, AppGlobalError } from '../../../shared/exception/base';
import { Responsibility } from '../../../shared/common/responsibility';
import { AppMessage } from '../../../shared/common/appMessage';


export interface IRegisterUserRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
export default class RegisterUserUseCase {
    private userRepository: IUserRepository;
    private passwordHasher: IPasswordHasher;

    constructor(
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.PasswordHasher) passwordHasher: IPasswordHasher
    ) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    public async execute(request: IRegisterUserRequest): Promise<User> {
        const { name, email, password } = request;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new APIException(
                Responsibility.CLIENT_BAD_REQUEST,
                AppMessage.API_E_008,
                [new AppGlobalError("API_E_008", AppMessage.API_E_008)],
            );
        }

        // Hash password
        const hashedPassword = await this.passwordHasher.hash(password);

        // Create user entity
        const user = User.create(name, email, hashedPassword);

        // Save user
        const savedUser = await this.userRepository.create(user);
        return savedUser;
    }
}