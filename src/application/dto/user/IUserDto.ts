export interface RegisterUserDto {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
