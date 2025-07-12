import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import User from "../../../domain/entities/User";
import { TYPES } from "../../../infrastructure/container/types";

@injectable()
export default class GetProfileUseCase {
    private userRepository: IUserRepository;

    constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async execute(userId: string): Promise<User | null> {
        const user = await this.userRepository.findById("userId");
        return user;
    }
}