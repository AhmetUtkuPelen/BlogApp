import { Request, Response, NextFunction } from "express";



export class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }




  export const ErrorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    });
    
  };