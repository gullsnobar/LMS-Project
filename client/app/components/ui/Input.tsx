import React from "react";

type InputProps = {
    label?: string;
    id?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, id, type = "text", error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-Poppins"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={id}
                    type={type}
                    ref={ref}
                    className={`
            w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#2190ff] focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-gray-700 dark:text-white dark:focus:ring-[#2190ff]
            font-Poppins
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500 font-Poppins">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
