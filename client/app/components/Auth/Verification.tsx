"use client";
import React, { FC, useState, useRef, KeyboardEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useActivationMutation } from "../../../redux/features/auth/authApi";

type Props = {
    setRoute: (route: "Login" | "Sign-Up" | "Verification") => void;
    setOpen: (open: boolean) => void;
    isPage?: boolean;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
};

const Verification: FC<Props> = ({ setRoute, setOpen, isPage = false }) => {
    const [invalidError, setInvalidError] = useState(false);
    const [activation, { isSuccess, error, isLoading }] = useActivationMutation();

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": "",
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Account verified successfully!");
            // Clear the activation token from localStorage
            localStorage.removeItem("activation_token");
            if (isPage) {
                // Handle page navigation if needed
                window.location.href = "/login";
            } else {
                setRoute("Login");
            }
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message || "Invalid verification code");
                setInvalidError(true);
            }
        }
    }, [isSuccess, error, isPage, setRoute]);

    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("");
        if (verificationNumber.length !== 4) {
            setInvalidError(true);
            toast.error("Please enter all 4 digits");
            return;
        }

        // API call for verification
        await activation({
            activation_token: localStorage.getItem("activation_token"),
            activation_code: verificationNumber,
        });
    };

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verifyNumber };

        // Only allow numbers
        if (value && !/^[0-9]$/.test(value)) {
            return;
        }

        newVerifyNumber[String(index) as keyof VerifyNumber] = value;
        setVerifyNumber(newVerifyNumber);

        // Move to next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace
        if (e.key === "Backspace" && !verifyNumber[String(index) as keyof VerifyNumber] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 4);

        if (!/^\d+$/.test(pastedData)) {
            toast.error("Please paste only numbers");
            return;
        }

        const newVerifyNumber = { ...verifyNumber };
        pastedData.split("").forEach((char, index) => {
            if (index < 4) {
                newVerifyNumber[String(index) as keyof VerifyNumber] = char;
            }
        });
        setVerifyNumber(newVerifyNumber);

        // Focus on the last filled input or next empty one
        const nextIndex = Math.min(pastedData.length, 3);
        inputRefs[nextIndex].current?.focus();
    };

    const content = (
        <div className="w-full">
            {/* Header with Icon */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                    <VscWorkspaceTrusted className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Verify Your Account
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent a 4-digit verification code to your email
                </p>
            </div>

            {/* OTP Input Fields */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                    Enter Verification Code
                </label>
                <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
                    {[0, 1, 2, 3].map((index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            maxLength={1}
                            value={verifyNumber[String(index) as keyof VerifyNumber]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 ${invalidError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                    ))}
                </div>
                {invalidError && (
                    <p className="text-red-500 text-xs text-center mt-2">
                        Invalid verification code. Please try again.
                    </p>
                )}
            </div>

            {/* Verify Button */}
            <button
                onClick={verificationHandler}
                className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={Object.values(verifyNumber).some((num) => num === "") || isLoading}
            >
                {isLoading ? "Verifying..." : "Verify Account"}
            </button>

            {/* Resend Code */}
            <div className="text-center mt-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Didn't receive the code?
                </p>
                <button
                    type="button"
                    onClick={() => {
                        toast.success("Verification code resent!");
                        // Add resend logic here
                    }}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                    Resend Code
                </button>
            </div>

            {/* Back to Sign Up */}
            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={() => setRoute("Sign-Up")}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    ← Back to Sign Up
                </button>
            </div>
        </div>
    );

    if (isPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-6 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-[100px] left-[50px] w-[300px] h-[300px] bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl" />
                <div className="absolute bottom-[100px] right-[50px] w-[250px] h-[250px] bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl" />

                {/* Verification Card */}
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

export default Verification;