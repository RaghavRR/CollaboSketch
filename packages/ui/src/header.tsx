"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Menu, X } from "lucide-react";
import Link from "next/link";
import Button from "./button";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled
            ? "bg-white/30 backdrop-blur-md border-b border-white/30 py-2 shadow-md"
            : "bg-white/20 backdrop-blur-md py-4"
        }
      `}
      style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
  <div className="bg-gradient-to-br from-purple-100 to-teal-100 p-2 rounded-full shadow-md animate-pulse-slow">
    <Pencil className="h-6 w-6 text-purple-600" />
  </div>
  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-teal-500 text-transparent bg-clip-text">
    CollaboSketch
  </span>
</Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-lg text-gray-700 hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-lg text-gray-700 hover:text-purple-600 transition-colors"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className="text-lg text-gray-700 hover:text-purple-600 transition-colors"
            >
              Testimonials
            </a>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 transition text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md inline-block text-center"
              aria-label="Get Started"
            >
              Get Started
            </Link>

          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/40 backdrop-blur-md border-t border-white/30 shadow-md py-4 px-4 flex flex-col space-y-4">
          {["features", "how-it-works", "testimonials"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-gray-700 hover:text-purple-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {id
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </a>
          ))}
          <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
