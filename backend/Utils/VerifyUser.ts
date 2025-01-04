import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Error_Handler } from './Error';


declare module 'express' {
    interface Request {
      user?: any;  // ? Or define a proper user type instead of 'any'
    }
  }




  export const VerifyUser = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    
    if (!token) {
      next(Error_Handler(401, 'Unauthorized'));
      return;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch (error) {
      next(Error_Handler(401, 'Invalid token'));
    }
  };