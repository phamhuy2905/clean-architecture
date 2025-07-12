import { NextFunction, Request, Response, } from "express";
import { APIException, AppFieldError, AppGlobalError } from "../../shared/exception/base";
import { AppMessage } from "../../shared/common/appMessage";
import { Responsibility } from "../../shared/common/responsibility";
export function throwErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Error occurred:', err);
    let statusCode = 500;
    let globalErrors = [new AppGlobalError('SERVER_ERROR', AppMessage.API_E_002)];
    let fieldErrors: AppFieldError[] = [];
    let message = err.message || 'An unexpected error occurred';
    if (err instanceof APIException) {
        statusCode = err.type;
        globalErrors = err.globalErrors || [];
        fieldErrors = err.fieldErrors || [];
        message = err.message;
    }
    res.status(statusCode).json({
        message: message,
        globalErrors,
        fieldErrors
    });
};


export function routerNotFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    res.status(Responsibility.CLIENT_NOT_FOUND).json({
        message: 'Router Not Found',
        globalErrors: [new AppGlobalError('API_E_009', AppMessage.API_E_009)],
        fieldErrors: []
    });
}