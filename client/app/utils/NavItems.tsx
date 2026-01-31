"use client";

import Link from "next/link";
import React, { FC } from "react";
import { usePathname } from "next/navigation";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
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
          ? "flex flex-col space-y-4"
          : "flex items-center space-x-10"
      }`}
    >
      {navItemsData.map((item, index) => {
        const isActive = pathname === item.url;

        return (
          <Link
            key={index}
            href={item.url}
            className={`text-[18px] font-poppins font-[500] transition duration-200 ${
              isActive
                ? "text-[#37a39a]"
                : "text-black dark:text-white hover:text-[#37a39a]"
            } ${isMobile ? "py-2" : ""}`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavItems;
