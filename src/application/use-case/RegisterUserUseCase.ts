import { injectable, inject } from 'inversify';
import User from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../domain/services/IPasswordHasher";
import { TYPES } from "../../infrastructure/container/types";


export interface IRegisterUserRequestDTO {
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

    public async execute(request: IRegisterUserRequestDTO): Promise<User> {
        try {
            const { name, email, password } = request;

            // Validate input
            this.validateRequest(request);

            // Check if user already exists
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Hash password
            const hashedPassword = await this.passwordHasher.hash(password);

            // Create user entity
            const user = User.create(name, email, hashedPassword);

            // Save user
            const savedUser = await this.userRepository.create(user);

            return savedUser;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to register user");
        }
    }

    private validateRequest(request: IRegisterUserRequestDTO): void {
        if (!request) {
            throw new Error("Request is required");
        }

        const { name, email, password } = request;

        if (!name) {
            throw new Error("Name is required");
        }

        if (!email) {
            throw new Error("Email is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }
    }
}