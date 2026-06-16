import { Request, Response, NextFunction } from 'express';
import { catchAsyncErrors } from './catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import jwt from 'jsonwebtoken';
import { redis } from '../utils/redis';
import userModel from '../models/user.model';

// Extend the Request type to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const isAuthenticated = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN as string
      ) as { id: string };
    } catch {
      return next(new ErrorHandler('Invalid or expired token. Please login again', 401));
    }

    // Try Redis cache first; fall back to DB if Redis is unavailable or cache miss
    const cached = await redis.get(decoded.id);

    if (cached) {
      req.user = JSON.parse(cached);
      return next();
    }

    // DB fallback — works even without Redis
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler('Session expired. Please login again', 401));
    }

    // Re-populate cache if Redis is available
    await redis.set(decoded.id, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60);

    req.user = user;
    next();
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role ?? 'unknown'} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};