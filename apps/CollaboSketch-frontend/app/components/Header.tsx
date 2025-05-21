"use client";
import React, { useState } from "react";
import { Pencil, Menu, X } from "lucide-react";

export const Header = ({
  name,
  onLogout,
}: {
  name: string;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-purple-100 shadow-[0_3px_15px_rgba(124,58,237,0.05)] sticky top-0 z-50 transition-all">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-purple-100 to-teal-100 p-2 rounded-full shadow-md animate-pulse-slow">
        <Pencil className="h-6 w-6 text-purple-600" />
      </div>
      <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text">
        CollaboSketch
      </span>
    </div>

    {/* Desktop User Info */}
    <div className="hidden sm:flex items-center gap-4">
      <span className="text-lg sm:text-xl font-medium text-gray-700">
        Welcome back, <span className="text-purple-700 font-semibold">{name}</span>✨

      </span>
      <button
  onClick={onLogout}
  className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 transition text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md"
  aria-label="Logout"
>
  Logout
</button>

    </div>

    {/* Mobile Menu Toggle */}
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-purple-700 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  </div>

  {/* Mobile Dropdown */}
  {isOpen && (
    <div className="sm:hidden border-t border-purple-100 px-4 pt-4 pb-6">
      <div className="text-center text-base font-medium text-gray-700 mb-3">
        Hello, <span className="text-purple-700 font-semibold">{name}</span> 👋
      </div>
      <div className="flex justify-center">
        <button
          onClick={onLogout}
          className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md text-sm"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  )}
</header>

  );
};
