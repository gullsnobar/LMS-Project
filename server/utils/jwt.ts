require("dotenv").config();

import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "../utils/redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // store session data in redis using user._id as key
  // (isAuthenticated middleware looks up redis.get(decoded.id) where decoded.id = user._id)
  redis.set(
    user._id.toString(),
    JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      courses: (user as any).courses || [],
    }),
    'EX',
    7 * 24 * 60 * 60  // 7 days TTL
  );


  const accessTokenExpire =
    parseInt(process.env.ACCESS_TOKEN_EXPIRE || "15", 10) * 60 * 1000; // 15 minutes in ms

  const refreshTokenExpire =
    parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7", 10) *
    24 *
    60 *
    60 *
    1000; // 7 days

  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire),
    maxAge: accessTokenExpire,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire),
    maxAge: refreshTokenExpire,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    message: "Tokens sent successfully",
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      courses: (user as any).courses || [],
    },
  });
};
