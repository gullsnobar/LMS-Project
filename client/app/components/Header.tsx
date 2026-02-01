"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModel";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

const Header: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [route, setRoute] = useState<"Login" | "Sign-Up" | "Verification">("Login");
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="w-full relative">
      {/* Navbar */}
      <div
        className={`${scrolled
          ? "fixed top-0 left-0 w-full h-[80px] z-50 border-b border-transparent dark:border-[#ffffff1c] shadow-xl transition-all duration-500 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black"
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

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems activeItem={activeItem} isMobile={false} />
            <ThemeSwitcher />
            <HiOutlineUserCircle
              size={25}
              className="cursor-pointer text-black dark:text-white hover:text-[#37a39a] transition-colors duration-200"
              onClick={() => {
                setRoute("Login");
                setModalOpen(true);
              }}
            />
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeSwitcher />
            <HiOutlineUserCircle
              size={25}
              className="cursor-pointer text-black dark:text-white hover:text-[#37a39a] transition-colors duration-200"
              onClick={() => {
                setRoute("Login");
                setModalOpen(true);
              }}
            />
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-black dark:text-white text-[26px]"
              aria-label="Open Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[80px] left-0 w-full bg-white dark:bg-black z-40 shadow-md p-5 md:hidden">
          <NavItems activeItem={activeItem} isMobile />
        </div>
      )}

      {/* Modal */}
      <CustomModal open={modalOpen} setOpen={setModalOpen}>
        {route === "Login" ? (
          <Login setRoute={(r) => setRoute(r)} setOpen={setModalOpen} />
        ) : (
          <SignUp setRoute={(r: "Login" | "Sign-Up" | "Verification") => setRoute(r)} setOpen={setModalOpen} />
        )}
      </CustomModal>
    </header>
  );
};

export default Header;
