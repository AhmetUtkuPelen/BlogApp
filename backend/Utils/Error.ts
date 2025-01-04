export class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }



  export const Error_Handler = (statusCode: number, message: string): CustomError => {
    return new CustomError(message, statusCode);
  };