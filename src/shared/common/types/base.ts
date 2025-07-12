import { Request, Response, NextFunction } from "express";
import z from "zod";

export type THandler = <T>(req: Request, res: Response, Next: NextFunction) => Promise<any> | T;
export type TRouter = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    validator?: z.ZodType<any>;
    handler: THandler;
    isAuthenticated?: boolean;
    withParams?: string[],
};

export type TAppRouter = {
    [key: string]: TRouter;
};