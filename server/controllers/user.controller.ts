import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

// ===============================
// Register User Interface
// ===============================

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// ===============================
// Activation Token Interface
// ===============================
interface IActivationToken {
  token: string;
  activationCode: string;
}

// ===============================
// Register User
// ===============================
export const registerationUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };

    const activationToken = createActivasionToken(user);
    const { activationCode } = activationToken;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      template: "activationEmail.ejs",
      data: {
        name: user.name,
        activationCode,
      },
    });

    res.status(201).json({
      success: true,
      message: "Activation email sent successfully",
      activationToken,
    });
  }
);

// ===============================
// Create Activation Token
// ===============================
export const createActivasionToken = (
  payload: IRegistrationBody
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { ...payload, activationCode },
    process.env.ACTIVATION_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  return {
    token,
    activationCode,
  };
};

// ===============================
// Activate User Interface
// ===============================
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// ===============================
// Activate User
// ===============================
export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET as string
      ) as IRegistrationBody & { activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password, avatar } = newUser;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const user = new userModel({
        name,
        email,
        password,
        avatar,
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: "User activated successfully",
      });
    } catch (error) {
      return next(
        new ErrorHandler("Invalid or expired activation token", 400)
      );
    }
  }
);

// ===============================
// Login User Interface
// ===============================
interface ILoginBody {
  email: string;
  password: string;
}

// ===============================
// Login User
// ===============================
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: ILoginBody = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  }
);

// ===============================
// Logout User
// ===============================
export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new ErrorHandler("No refresh token provided", 400));
    }

    // Remove the refresh token from Redis or database
    await redis.del(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

// update access token

export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(new ErrorHandler("No refresh token provided", 400));
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;

      const userData = await redis.get(decoded.id);

      if (!userData) {
        return next(new ErrorHandler("Session expired. Please login again", 401));
      }

      const user = JSON.parse(userData);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        success: true,
        message: "New access token generated",
        accessToken,
      });
    } catch (error) {
      return next(new ErrorHandler("Invalid refresh token. Please login again", 401));
    }
  }
);