import { NextFunction, Request, Response } from "express";
import RegisterUserUseCase from "../../application/use-case/auth/RegisterUserUseCase";
import LoginUserUseCase from "../../application/use-case/auth/LoginUserUseCase";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/container/types";
import { OK } from "../http/response/successResponse";
import { UserMapper } from "../../application/mapper/UserMapper";

@injectable()
export default class AuthController {
    private registerUserUseCase: RegisterUserUseCase;
    private loginUserUseCase: LoginUserUseCase;

    constructor(
        @inject(TYPES.RegisterUserUseCase) registerUserUseCase: RegisterUserUseCase,
        @inject(TYPES.LoginUserUseCase) loginUserUseCase: LoginUserUseCase
    ) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    public async register(request: Request, response: Response, next: NextFunction) {
        const { name, email, password } = request.body;

        const user = await this.registerUserUseCase.execute({ name, email, password });

        const userResponse = UserMapper.toDto(user);

        return new OK({ data: userResponse }).send(response);
    }


    public async login(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;


        const user = await this.loginUserUseCase.execute({ email, password });

        const userResponse = UserMapper.toDto(user);

        return new OK({ data: userResponse }).send(response);
    }

}