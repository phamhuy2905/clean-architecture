import { NextFunction, Request, Response } from "express";
import RegisterUserUseCase, { IRegisterUserRequestDTO } from "../../application/use-case/RegisterUserUseCase";

export class CreateUserController {
    private registerUserUseCase: RegisterUserUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    public async handle(request: Request, response: Response, next: NextFunction): Promise<any> {
        const { name, email, password } = request.body;

        const requestDto: IRegisterUserRequestDTO = { name, email, password };

        const user = await this.registerUserUseCase.execute(requestDto);

        const userResponse = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            isBlocked: user.isBlocked()
        };
        return response.status(201).json(userResponse);
    }
}