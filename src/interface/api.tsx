

interface ServerError {
    Status: 'error';
    code: 'SERVER_ERROR';
    Data: { [key: string]: any }; // Specify the structure based on your requirements
    Message: string;
}

interface FieldValidationError {
    Status: 'error';
    code: 'FIELD_VALIDATION_ERROR';
    Data: {
        field: string
        tag: string
        param: string
        'actual_value': { [key: string]: any }
        error: string
    }[]; 
    Message: string;
}

interface BodyError {
    Status: 'error';
    code: 'BODY_ERROR';
    Data: { [key: string]: any }; 
    Message: string;
}

interface SuccessResponse {
    Status: 'success';
    code: 'SUCCESS';
    Data: { [key: string]: any };
    Message: string;
}

export type ApiResponse = ServerError | FieldValidationError | BodyError | SuccessResponse
