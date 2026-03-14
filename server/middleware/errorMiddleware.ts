import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';


const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    let error = err;

    // Default values
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Internal Server Error';

    /**
     * =========================
     * MONGOOSE / MONGODB ERRORS
     * =========================
     */

    // Invalid MongoDB ObjectId
    if (error.name === 'CastError') {
        error = new ErrorHandler(
            `Resource not found. Invalid: ${error.path}`,
            400
        );
    }

    // Duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        error = new ErrorHandler(
            `Duplicate value entered for ${field}`,
            400
        );
    }

    /**
     * ==========
     * JWT ERRORS
     * ==========`
     */

    // Invalid JWT
    if (error.name === 'JsonWebTokenError') {
        error = new ErrorHandler(
            'Invalid token, please login again',
            401
        );
    }

    // Expired JWT
    if (error.name === 'TokenExpiredError') {
        error = new ErrorHandler(
            'Token expired, please login again',
            401
        );
    }

    /**
     * ======================
     * FINAL ERROR RESPONSE
     * ======================
     */

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};

export default errorMiddleware;
