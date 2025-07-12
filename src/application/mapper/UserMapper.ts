import User from "../../domain/entities/User";
import { UserResponseDto } from "../dto/user/IUserDto";

export class UserMapper {

    static toDto(user: User): UserResponseDto {
        return {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            isBlocked: user.isBlocked()
        };
    }


    static toDtoList(users: User[]): UserResponseDto[] {
        return users.map(user => this.toDto(user));
    }


    static toEntity(dto: UserResponseDto): User {
        return new User(dto.id, dto.name, dto.email, '');
    }
}
