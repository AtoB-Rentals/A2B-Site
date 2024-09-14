

export const apiURL = process.env.NEXT_PUBLIC_API!


export interface ApiRes<T> {
    status: string; // or whatever type response.Success is
    message: string;
    data: T;
    isErr: false
}

export interface err {
    status: number,
    message: string
    code: errorCodes
    data: any
    isErr: true
}

export type errorCodes = "BODY_ERROR" |
    "FIELD_VALIDATION_ERROR" |
    "SERVER_ERROR" |
    "UNAUTHORIZED" |
    "UNKNOWN"

export const throwError = (
    res: Response,
    err: err
): err => {

    return {
        status: res.status,
        code: err.code || "UNKNOWN",
        message: err.message || "",
        data: err || {},
        isErr: true
    }
}

export const unknownErr = (msg?: string): err => ({
    status: 0,
    code: "SERVER_ERROR",
    message: msg || "",
    data: {},
    isErr: true,
})