import { roleT } from '../../interface/api'

export const apiURL = process.env.NEXT_PUBLIC_API!
export const siteURL = process.env.NEXT_PUBLIC_WEB_URL!

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

export type QueryParams<T extends Record<string, any> = Record<string, string | number | boolean | undefined | null>> = {
    [K in keyof T]?: T[K] | string | number | boolean | undefined | null;
};


export const objectToQueryString = (params: QueryParams): string => {
    const query = new URLSearchParams();

    // Iterate over each key in the object
    Object.entries(params).forEach(([key, value]) => {
        // Add the key-value pair to the query string if the value is not undefined or null
        if (value !== undefined && value !== null) {
            query.append(key, String(value)); // Ensure value is converted to a string
        }
    });

    return query.toString();
} // make sure to load your secret from .env

/**valid roles */
export const vR = (...roles: roleT[]): boolean => {
    return roles.includes(localStorage.getItem("role") as roleT);
}

export const extractFirstParenthesesValue = (input: string): string | null => {
    const openIndex = input.indexOf('(');
    const closeIndex = input.indexOf(')', openIndex);

    if (openIndex !== -1 && closeIndex !== -1 && closeIndex > openIndex) {
        return input.substring(openIndex + 1, closeIndex);
    }

    // Return null if no valid parentheses pair is found
    return null;
}