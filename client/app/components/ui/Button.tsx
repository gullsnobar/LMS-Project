import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    type = "button",
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-full font-Poppins font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[#2190ff] text-white hover:bg-[#1a7cd6] focus:ring-[#2190ff]",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3.5 text-lg",
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
