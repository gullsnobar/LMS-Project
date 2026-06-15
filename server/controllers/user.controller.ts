import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";
import courseModel from "../models/course.models";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import cloudinary from "../utils/cloudinary";
import { getAllUsersService } from "../services/user.service";

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


      // Define token options (should match those in utils/jwt.ts)
      const accessTokenExpire =
        parseInt(process.env.ACCESS_TOKEN_EXPIRE || "15", 10) * 60 * 1000; // 15 minutes
      const refreshTokenExpire =
        parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7", 10) * 24 * 60 * 60 * 1000; // 7 days

      const accessTokenOptions: import('express').CookieOptions = {
        expires: new Date(Date.now() + accessTokenExpire),
        maxAge: accessTokenExpire,
        httpOnly: true,
        sameSite: 'lax' as 'lax',
        secure: process.env.NODE_ENV === "production",
      };

      const refreshTokenOptions: import('express').CookieOptions = {
        expires: new Date(Date.now() + refreshTokenExpire),
        maxAge: refreshTokenExpire,
        httpOnly: true,
        sameSite: 'lax' as 'lax',
        secure: process.env.NODE_ENV === "production",
      };

      // Set cookies with correct names and options
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refresh_token, refreshTokenOptions);

      res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        accessToken,
      });

    } catch (error) {
      return next(new ErrorHandler("Invalid refresh token. Please login again", 401));
    }
  }
);

// get user Info

export const getUserInfo = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      // Try Redis cache first
      const cached = await redis.get(userId);
      if (cached) {
        const user = JSON.parse(cached);
        return res.status(200).json({ success: true, user });
      }

      // Fallback: fetch from DB and cache
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Cache for 7 days
      await redis.set(userId, JSON.stringify(user), "EX", 7 * 24 * 60 * 60);

      return res.status(200).json({ success: true, user });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return next(new ErrorHandler(message, 400));
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}


// social auth

export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = new userModel({
          name,
          email,
          password: email + process.env.JWT_SECRET,
          avatar,
        });
        await newUser.save();
        sendToken(newUser, 200, res);
      }
      else {
        sendToken(user, 200, res);
      }
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return next(new ErrorHandler(message, 400));
    }
  }
);

// update user Info

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export const updateUserInfo = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if (email && user) {
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already in use", 400));
      }
      user.email = email;
    }

    if (name && user) {
      user.name = name;
    }
    await user?.save();
    // Set user in Redis with expiry (ioredis syntax: EX is a positional argument, not an object property)
    await redis.set(userId, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return next(new ErrorHandler(message, 400));
  }
});


// update user password

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;
    const userId = req.user?._id;
    const user = await userModel.findById(userId).select("+password");

    const isPasswordMatched = await user?.comparePassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (user?.password === undefined) {
      return next(new ErrorHandler("Password not set for this user", 400));
    }

    user.password = newPassword;
    await user.save();

    // Update the cached user in Redis
    await redis.set(userId, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60);

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    return next(new ErrorHandler(message, 400));
  }
});


// update profile picture

interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;

      if (!avatar) {
        return next(new ErrorHandler("Avatar is required", 400));
      }

      const userId = req.user?._id;
      if (!userId) {
        return next(new ErrorHandler("Unauthorized", 401));
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Delete old avatar if exists
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // Upload new avatar
      const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        avatar: user.avatar,
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);


// Get All users

export const getAllUsers = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllUsersService(res);
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);


// update user role  -- admin only

export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      user.role = role;
      await user.save();
      res.status(200).json({
        success: true,
        message: "User role updated successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);


// delete user -- admin only

export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne();
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);

// delete course -- admin only

export const deleteCourse = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const course = await courseModel.findById(id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      await course.deleteOne();
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        return next(new ErrorHandler(error.message, 400));
      }
      return next(new ErrorHandler("Something went wrong", 500));
    }
  }
);
