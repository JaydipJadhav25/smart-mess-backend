
export class ApiError extends Error{
    constructor(statusCode ,name , message  ){
        super(message);
        this.name = name
        this.message = message;
        this.status = statusCode;
    }
}