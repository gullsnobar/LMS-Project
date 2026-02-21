"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 group"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <BiMoon
            size={22}
            className="text-white transition-transform duration-300 group-hover:rotate-12"
          />
        ) : (
          <BiSun
            size={22}
            className="text-white transition-transform duration-300 group-hover:rotate-90"
          />
        )}
        <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
      </button>
    </div>
  );
};
