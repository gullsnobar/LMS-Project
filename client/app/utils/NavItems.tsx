"use client";

import Link from "next/link";
import React, { FC } from "react";
import { usePathname } from "next/navigation";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
  { name: "Dashboard", url: "/dashboard" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: FC<Props> = ({ isMobile }) => {
  const pathname = usePathname();

  return (
    <nav
      className={`${
        isMobile
          ? "flex flex-col space-y-2"
          : "flex items-center space-x-1"
      }`}
    >
      {navItemsData.map((item, index) => {
        const isActive = pathname === item.url;

        return (
          <Link
            key={index}
            href={item.url}
            className={`relative text-[15px] font-poppins font-semibold transition-all duration-300 ${
              isMobile
                ? "py-3 px-4 rounded-lg"
                : "py-2 px-4 rounded-lg"
            } ${
              isActive
                ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.name}
            {isActive && !isMobile && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavItems;
