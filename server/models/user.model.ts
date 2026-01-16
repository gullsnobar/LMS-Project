import { Schema, model, HydratedDocument, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

/* =======================
   Email Regex
======================= */
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =======================
   User Interface
======================= */
export interface IUser extends Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: "user" | "admin";
  isVerified: boolean;
  courses: {
    courseId: string;
  }[];
}

/* =======================
   Methods Interface
======================= */
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  SignAccessToken(): string;
  SignRefreshToken(): string;
}

/* =======================
   Model Interface
======================= */
interface UserModel extends Model<IUser, {}, IUserMethods> {}

/* =======================
   User Schema
======================= */
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      minlength: [4, "Name should have more than 4 characters"],
      maxlength: [30, "Name cannot exceed 30 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      match: [emailRegex, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password should be at least 8 characters"],
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        courseId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

/* =======================
   Schema Methods
======================= */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.SignAccessToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN as string,
    { expiresIn: "15m" }
  );
};

userSchema.methods.SignRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN as string,
    { expiresIn: "7d" }
  );
};

/* =======================
   Hash Password
======================= */
userSchema.pre("save", async function (
  this: HydratedDocument<IUser, IUserMethods>
) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* =======================
   User Model
======================= */
const User = model<IUser, UserModel>("User", userSchema);

export default User;
