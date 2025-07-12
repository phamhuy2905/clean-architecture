import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../infrastructure/container/types";
import GetProfileUseCase from "../../application/use-case/user/GetProfileUseCase";
import { OK } from "../http/response/successResponse";
import { UserMapper } from "../../application/mapper/UserMapper";

@injectable()
export default class UserController {
    private getProfileUseCase: GetProfileUseCase;

    constructor(
        @inject(TYPES.GetProfileUseCase) getProfileUseCase: GetProfileUseCase
    ) {
        this.getProfileUseCase = getProfileUseCase;
    }

    public async getProfile(request: Request, response: Response, next: NextFunction) {
        const userId = 'test';
        const user = await this.getProfileUseCase.execute(userId);
        let userResponse = null;
        if (user) {
            userResponse = UserMapper.toDto(user);
        }
        return new OK({ data: userResponse }).send(response);
    }
}