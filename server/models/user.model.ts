import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

/* =======================
   Email Regex
======================= */
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =======================
   User Interface
======================= */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: "user" | "admin";
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* =======================
   User Schema
======================= */
const userSchema = new Schema<IUser>(
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
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* =======================
   Hash Password (Modern)
======================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

/* =======================
   Compare Password
======================= */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* =======================
   User Model
======================= */
const User = model<IUser>("User", userSchema);

export default User;
