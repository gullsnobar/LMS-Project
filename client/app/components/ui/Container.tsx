import React from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const Container: React.FC<Props> = ({ children, className = "" }) => {
    return (
        <div
            className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
        >
            {children}
        </div>
    );
};

export default Container;
