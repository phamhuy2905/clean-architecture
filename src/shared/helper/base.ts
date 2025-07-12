import express, { Express } from "express";
import _ from "lodash";
import { TAppRouter, THandler } from "../common/types/base";
import { APIException, AppFieldError } from "../exception/base";
import { Responsibility } from "../common/responsibility";

export function wrapHandler(instance: any, methodName = 'handler') {
    return instance[methodName].bind(instance) as THandler;
}

export function applyRouter(app: Express, appRouter: Record<string, TAppRouter>) {
    _.forEach(appRouter, (router, path) => {
        _.forEach(router, (route, childPath) => {
            const { method, handler, validator } = route;

            const methodLower = method.toLowerCase() as keyof express.Application;
            const fullPath = parseRouter(`/api/${path}`, childPath, route.withParams || []);
            if (validator) {
                const validateMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
                    const validationResult = validator.safeParse({
                        ...req.body,
                        ...req.params,
                    });
                    if (!validationResult.success) {
                        const paths = _.keys(validationResult.error.flatten().fieldErrors);

                        const fieldErrors = paths.map(path => {
                            return new AppFieldError(path, (validationResult as any).error.flatten().fieldErrors[path].join(', '));
                        }) || [];

                        throw new APIException(
                            Responsibility.CLIENT_VALIDATOR_ERROR,
                            "Client validation error",
                            null,
                            fieldErrors
                        );
                    }
                    next();
                };
                app[methodLower](fullPath, validateMiddleware, handler);
            }
            else {
                app[methodLower](fullPath, handler);
            }
        });
    });

}


function parseRouter(parentPath: string, childPath: string, withParams: string[] = []) {
    const paramString = withParams.length > 0 ? `/:${withParams.join('/:')}` : '';
    const fullPath = `${parentPath}.${childPath}${paramString}`;
    return fullPath;
}
