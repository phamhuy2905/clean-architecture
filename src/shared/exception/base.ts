export class AppGlobalError {
    errorId: string;
    errorMessage: string;

    constructor(errorId: string, errorMessage: string) {
        this.errorId = errorId;
        this.errorMessage = errorMessage;
    }
}

export class AppFieldError {
    errorMessage: string;
    field: string;

    constructor(field: string, errorMessage: string) {
        this.errorMessage = errorMessage;
        this.field = field;
    }
}

export class APIException extends Error {
    type: number = 0;
    message: string = "";
    globalErrors: AppGlobalError[] | null = null;
    fieldErrors: AppFieldError[] | null = null;

    constructor(
        type: number,
        message: string,
        globalErrors: AppGlobalError[] | null = null,
        fieldErrors: AppFieldError[] | null = null
    ) {
        super(message);
        this.type = type;
        this.message = message;
        this.globalErrors = globalErrors || null;
        this.fieldErrors = fieldErrors || null;
    }
}


// SIMULATE

// throw new APIException(
//     Responsibility.SERVER,
//     "DB error occurred",
//     [new AppGlobalError("API_E_001", AppMessage.API_E_001)],
//     null
// );


// throw new APIException(
//     Responsibility.CLIENT_BAD_REQUEST,
//     "Password update failed",
//     null,
//     [new AppFieldError("API_E_002", AppMessage.API_E_002, "currentPassword")]
// );