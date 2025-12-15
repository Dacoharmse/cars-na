"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, Pencil, Lock, Search, Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import CarFilterSearch from "@/components/CarFilterSearch";
import DealersDropdown from "@/components/DealersDropdown";
import NotificationBell from "@/components/NotificationBell";

const navLinks = [
  { href: "/vehicles", label: "Buy Cars" },
  { href: "/sell", label: "Sell Your Car" },
  { href: "/financing", label: "Financing" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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

  // Hide header on login pages
  if (pathname === '/admin/login' || pathname === '/dealer/login') {
    return null;
  }

  return (
    <>
      {/* Skip Link for Screen Readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Utility Bar */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-4 h-10 flex items-center justify-between">
          {/* Mobile Support Button */}
          <div className="flex md:hidden">
            <Link
              href="tel:+264-61-000-000"
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
              <span>Support</span>
            </Link>
          </div>

          {/* Desktop and Mobile Auth Buttons */}
          <div className="flex items-center gap-2 md:gap-8 ml-auto">
            {/* Support - Desktop Only */}
            <Link
              href="tel:+264-61-000-000"
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
              <span>Support</span>
            </Link>
            
            {/* Divider - Desktop Only */}
            <div className="hidden md:block w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
            
            {/* Authentication Buttons */}
            {session ? (
              // Logged In State
              <>
                {/* Dashboard Link - different for admin vs dealer */}
                {((session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na') ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 md:gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                  >
                    <Shield className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    href="/dealer/dashboard"
                    className="flex items-center gap-1 md:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <NotificationBell />
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <button
                  onClick={() => {
                    const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
                    const origin = window.location.origin;
                    const callbackUrl = isAdmin ? `${origin}/admin/login` : `${origin}/dealer/login`;
                    signOut({ callbackUrl });
                  }}
                  className="flex items-center gap-1 md:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                >
                  <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              // Logged Out State
              <>
                <Link
                  href="/dealer/login"
                  className="flex items-center gap-1 md:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
                >
                  <Lock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Dealership Login</span>
                </Link>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <Link
                  href="/dealers/register"
                  className="flex items-center gap-1 md:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white transition-colors group"
                >
                  <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> 
                  <span className="whitespace-nowrap">Dealership Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={clsx(
          "fixed inset-x-0 z-50 backdrop-blur-md transition-all duration-300 border-b",
          scrolled
            ? "top-10 h-14 shadow-lg bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/50"
            : "top-10 h-16 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
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
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            <ul role="list" className="flex items-center gap-8">
              <li>
                <DealersDropdown />
              </li>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="relative text-sm font-semibold text-slate-700 dark:text-slate-100 hover:text-[#1F3469] dark:hover:text-white transition-colors group py-2"
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1F3469] dark:bg-white group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Search Launcher */}
            <button
              type="button"
              onClick={() => setCpOpen(true)}
              aria-label="Open car search dialog"
              className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-[#1F3469] dark:hover:text-white px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ height: 44 }}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="whitespace-nowrap font-medium">Search Cars</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1F3469] dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ height: 44, width: 44 }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div 
              id="mobile-menu"
              className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-slate-900 shadow-lg p-6 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 id="mobile-menu-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Navigation
                </h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Close navigation menu"
                  style={{ height: 44, width: 44 }}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile navigation">
                <ul role="list" className="flex flex-col gap-4">
                  <li>
                    <DealersDropdown isMobile={true} />
                  </li>
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-semibold text-slate-700 dark:text-slate-100 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
                        aria-current={pathname === href ? 'page' : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setCpOpen(true);
                }}
                className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-2"
                style={{ minHeight: 44 }}
                aria-label="Open car search dialog"
              >
                <Search className="w-4 h-4" aria-hidden="true" /> Search
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
