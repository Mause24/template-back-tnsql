export const RESPONSES = {
    // GENERAL
    OK: {
        message: "OK",
        status: 200,
    },
    CREATED: {
        message: "CREATED",
        status: 201,
    },
    UPDATED: {
        message: "UPDATED",
        status: 200,
    },
    DELETED: {
        message: "DELETED",
        status: 200,
    },
    CANNOT_CREATE: {
        message: "CANNOT_CREATE",
        status: 500,
    },
    CANNOT_UPDATE: {
        message: "CANNOT_UPDATE",
        status: 500,
    },
    INVALID_TOKEN: {
        message: "INVALID_TOKEN",
        status: 401,
    },
    AUTHORIZATION_REQUIRED: {
        message: "AUTHORIZATION_REQUIRED",
        status: 403,
    },
    MISSING_TOKEN: {
        message: "MISSING_TOKEN",
        status: 401,
    },
    SERVER_ERROR: {
        message: "SERVER_ERROR",
        status: 500,
    },
    UNAUTHORIZED: {
        message: "UNAUTHORIZED",
        status: 401,
    },
    EMAIL_ALREADY_EXIST: {
        message: "EMAIL_ALREADY_EXIST",
        status: 409,
    },
    MISSING_ATTRIBUTE: {
        message: "MISSING_ATTRIBUTE",
        status: 400,
    },
    // USER
    USER_NOT_FOUND: {
        message: "USER_NOT_FOUND",
        status: 404,
    },
    INCORRECT_PASSWORD: {
        message: "INCORRECT_PASSWORD",
        status: 400,
    },
}
