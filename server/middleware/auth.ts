import {Request, Response, NextFunction} from 'express';
import { catchAsyncErrors } from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import jwt from 'jsonwebtoken';
import { redis } from "../utils/redis";

// Extend the Request type to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const isAuthenticated = catchAsyncErrors( async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    if(!accessToken) {
        return next(new ErrorHandler("Please login to access this resource", 400));
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as { id: string };
  
    if (!decoded){
        return next(new ErrorHandler("Invalid Token. Please login again", 401));
    }
  

    const user = await redis.get(decoded.id);

    if(!user) {
        return next(new ErrorHandler("Session expired. Please login again", 401));
    }

    req.user = JSON.parse(user);

    next();


});

// validate user role

export const authorizeRoles = (...roles: string[]) => {
return (req: Request, res: Response, next: NextFunction) => {
if(!roles.includes(req.user.role)) {    
return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
}
next(); 
};
};