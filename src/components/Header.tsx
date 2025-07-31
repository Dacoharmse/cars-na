"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Phone, Pencil, Lock, Search, Menu, X } from "lucide-react";
import CarFilterSearch from "@/components/CarFilterSearch";

const navLinks = [
  { href: "/vehicles", label: "Buy Cars" },
  { href: "/sell", label: "Sell Your Car" },
  { href: "/dealers", label: "Dealers" },
  { href: "/financing", label: "Financing" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cpOpen, setCpOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);



  return (
    <>
      {/* Utility Bar */}
      <div className="hidden md:block bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 h-10 flex items-center justify-end gap-8">
          <Link
            href="tel:+264-61-000-000"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
            <span>Support</span>
          </Link>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
          <Link
            href="/dealers/login"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
          >
            <Lock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
            <span>Dealership Login</span>
          </Link>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
          <Link
            href="/dealers/register"
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
          >
            <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
            <span>Dealership Registration</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={clsx(
          "fixed inset-x-0 z-40 backdrop-blur-md transition-all duration-300 border-b",
          scrolled
            ? "top-0 h-14 shadow-lg bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/50"
            : "top-10 md:top-10 h-16 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
        )}
      >
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image src="/cars-na-logo.png" alt="Cars.na logo" width={150} height={150} className="group-hover:scale-105 transition-transform" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-semibold text-slate-700 dark:text-slate-100 hover:text-[#1F3469] dark:hover:text-white transition-colors group py-2"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F3469] dark:bg-white group-hover:w-full transition-all duration-200"></span>
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Search Launcher */}
            <button
              type="button"
              onClick={() => setCpOpen(true)}
              role="search"
              className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ height: 44 }}
            >
              <Search className="w-4 h-4" />
              <span className="whitespace-nowrap font-medium">Search Cars</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1F3469] dark:hover:text-white transition-all duration-200"
              style={{ height: 44, width: 44 }}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-slate-900 shadow-lg p-6 flex flex-col gap-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="self-end p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
                style={{ height: 44, width: 44 }}
              >
                <X className="w-5 h-5" />
              </button>

              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-slate-700 dark:text-slate-100 hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setCpOpen(true);
                }}
                className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary"
                style={{ minHeight: 44 }}
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>
        )}
      </header>

      <CarFilterSearch open={cpOpen} onClose={() => setCpOpen(false)} />
      {/* Spacer to avoid content hidden behind fixed header */}
      <div className="h-16 md:h-20" aria-hidden />
    </>
  );
}
