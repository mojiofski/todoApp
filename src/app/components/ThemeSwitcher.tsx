"use client";

import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md dark:bg-gray-700 font-semibold ${
        theme === "light" ? "text-blue-600" : "text-yellow-500"
      }`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;
