import { Response } from "express";

class OK {
    private data: any;
    private message: string;
    private status: number;

    constructor({
        data,
        message = "OK",
        status = 200,
    }: {
        data: any;
        message?: string;
        status?: number;
    }) {
        this.data = data;
        this.message = message;
        this.status = status;
    }

    send(res: Response) {
        res.status(this.status).json({
            success: true,
            message: this.message,
            data: this.data,
        });
    }
}

class CREATED extends OK {
    constructor({
        data,
        message = "Created",
        status = 201,
    }: {
        data: any;
        message?: string;
        status?: number;
    }) {
        super({ data, message, status });
    }
}

export { OK, CREATED };