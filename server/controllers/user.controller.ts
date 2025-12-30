import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";

//  Correct template path
const templatePath = path.join(
  __dirname,
  "..",
  "views",
  "emails",
  "activationEmail.ejs"
);

// ===============================
// Register User
// ===============================
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

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

    //  FIXED: correct renderFile usage
    const html = await ejs.renderFile(templatePath, {
      name: user.name,
      activationCode,
    });

    // (email sending logic would use `html`)

    res.status(201).json({
      success: true,
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

  return { token, activationCode };
};
