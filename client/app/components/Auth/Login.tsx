"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    AiOutlineEyeInvisible,
    AiOutlineEye,
    AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { styles } from "../../styles/styles";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";


type Props = {
    setRoute?: (route: "Login" | "Sign-Up" | "Verification") => void;
    setOpen?: (open: boolean) => void;
    isPage?: boolean;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Login: FC<Props> = ({ setRoute, setOpen, isPage = false }) => {
    const [show, setShow] = useState(false);
    const [login, { isSuccess, error }] = useLoginMutation();
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            login({ email: values.email, password: values.password });
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Login Successfully!");
            if (isPage) {
                router.push("/dashboard");
            } else if (setOpen) {
                setOpen(false);
            }
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error, isPage, router, setOpen]);

    const { errors, touched, values, handleSubmit, handleChange } = formik;

    const content = (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Welcome to Elearning
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Login to continue your learning journey
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
                        htmlFor="email"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        id="email"
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.email && touched.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
                    />
                    {errors.email && touched.email && (
                        <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={!show ? "password" : "text"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            id="password"
                            placeholder="Enter your password"
                            className={`w-full px-4 py-2.5 pr-12 rounded-xl border ${errors.password && touched.password
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                        {!show ? (
                            <AiOutlineEyeInvisible
                                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                size={20}
                                onClick={() => setShow(true)}
                            />
                        ) : (
                            <AiOutlineEye
                                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                size={20}
                                onClick={() => setShow(false)}
                            />
                        )}
                    </div>
                    {errors.password && touched.password && (
                        <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                    Sign In
                </button>

                {/* Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => signIn("google")}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <FcGoogle size={22} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => signIn("github")}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <AiFillGithub size={22} className="text-gray-900 dark:text-white" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4">
                    Don't have an account?{" "}
                    {isPage ? (
                        <Link
                            href="/signup"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            Create Account
                        </Link>
                    ) : (
                        <span
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                            onClick={() => setRoute && setRoute("Sign-Up")}
                        >
                            Create Account
                        </span>
                    )}
                </p>
            </form>
        </div>
    );

    if (isPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-6 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-[100px] left-[50px] w-[300px] h-[300px] bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute bottom-[100px] right-[50px] w-[250px] h-[250px] bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl" />

                {/* Login Card */}
                <div className="w-full max-w-md relative z-10">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        {content}
                    </div>
                </div>
            </div>
        );
    }

    return content;
};

export default Login;