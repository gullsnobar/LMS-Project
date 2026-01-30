"use client";

import Link from "next/link";
import React, { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    activeItem: number;
    setRoute: Dispatch<SetStateAction<string>>;
};

const Header: FC<Props> = ({ open, setOpen, activeItem, setRoute }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="w-full relative">
            <div
                className={`${active
                        ? "fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black"
                        : "w-full h-[80px] border-b dark:border-[#ffffff1c]"
                    }`}
            >
                <div className="w-[95%] md:w-[92%] m-auto h-full flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-[25px] font-poppins font-[500] text-black dark:text-white"
                    >
                        ELearning
                    </Link>

                    {/* Desktop Navigation - visible on md and up */}
                    <div className="hidden md:flex items-center">
                        <NavItems activeItem={activeItem} isMobile={false} />
                    </div>

                    {/* Mobile Menu Button - visible only below md */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            className="text-black dark:text-white text-[25px]"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {open && (
                <div className="fixed top-[80px] left-0 w-full bg-white dark:bg-black z-[70] shadow-md p-5">
                    <NavItems activeItem={activeItem} isMobile={true} />
                </div>
            )}
        </header>
    );
};

export default Header;
