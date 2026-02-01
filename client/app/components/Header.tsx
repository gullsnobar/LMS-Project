"use client";

import Link from "next/link";
import { FC, Dispatch, SetStateAction, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineUserCircle } from "react-icons/hi";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeItem: number;
  setRoute: Dispatch<SetStateAction<string>>;
};

const Header: FC<Props> = ({ open, setOpen, activeItem }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-full relative">
      <div
        className={`${scrolled
            ? "fixed top-0 left-0 w-full h-[80px] z-[80] border-b border-transparent dark:border-[#ffffff1c] shadow-xl transition-all duration-500 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black"
            : "w-full h-[80px] border-b border-transparent dark:border-[#ffffff1c]"
          }`}
      >
        <div className="w-[95%] md:w-[92%] mx-auto h-full flex items-center justify-between">
          <Link
            href="/"
            className="text-[27px] font-poppins font-medium text-black dark:text-white"
          >
            ELearning
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavItems activeItem={activeItem} isMobile={false} />
            <ThemeSwitcher />
            <HiOutlineUserCircle
              size={25}
              className="cursor-pointer text-black dark:text-white hover:text-[#37a39a] transition-colors duration-200"
            />
          </div>

          <div className="flex md:hidden items-center gap-4">
            <ThemeSwitcher />
            <HiOutlineUserCircle
              size={25}
              className="cursor-pointer text-black dark:text-white hover:text-[#37a39a] transition-colors duration-200"
            />
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="text-black dark:text-white text-[26px]"
              aria-label="Open Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed top-[80px] left-0 w-full bg-white dark:bg-black z-[70] shadow-md p-5 md:hidden">
          <NavItems activeItem={activeItem} isMobile />
        </div>
      )}
    </header>
  );
};

export default Header;
