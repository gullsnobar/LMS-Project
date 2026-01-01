import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";

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
