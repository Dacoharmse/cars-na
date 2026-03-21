"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone, Lock, Search, Menu, X, LogOut, LayoutDashboard, Shield, UserPlus } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  if (pathname === '/admin/login' || pathname === '/dealer/login') {
    return null;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#CB2030] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[#CB2030] focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Utility Bar — thin, simple */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-gray-900 border-b border-gray-800">
        <div className="mx-auto max-w-6xl px-4 h-8 flex items-center justify-between text-xs">
          <Link
            href="tel:+264-61-000-000"
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>Support</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                {((session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na') ? (
                  <Link href="/admin" className="flex items-center gap-1.5 text-purple-300 hover:text-purple-200 transition-colors">
                    <Shield className="w-3 h-3" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                ) : (
                  <Link href="/dealer/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                    <LayoutDashboard className="w-3 h-3" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
                <NotificationBell />
                <button
                  onClick={() => {
                    const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
                    const origin = window.location.origin;
                    signOut({ callbackUrl: isAdmin ? `${origin}/admin/login` : `${origin}/dealer/login` });
                  }}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/dealer/login" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                  <Lock className="w-3 h-3" />
                  <span>Dealer Login</span>
                </Link>
                <div className="w-px h-3 bg-gray-700" />
                <Link href="/dealers/register" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                  <UserPlus className="w-3 h-3" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav — clean white */}
      <header
        className={clsx(
          "fixed inset-x-0 top-8 z-50 bg-white border-b transition-shadow duration-200",
          scrolled ? "shadow-sm border-gray-200" : "border-gray-100"
        )}
      >
        <div className="mx-auto max-w-6xl h-14 flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/cars-na-logo.png" alt="Cars.na" width={130} height={40} className="h-9 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            <DealersDropdown />
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === href
                    ? "text-[#CB2030] bg-red-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCpOpen(true)}
              aria-label="Open car search"
              className="hidden sm:flex items-center gap-2 h-9 px-3 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg bg-gray-50 hover:bg-white transition-all"
            >
              <Search className="w-4 h-4" />
              <span className="text-gray-400">Search...</span>
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mounted && mobileOpen && createPortal(
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50"
              style={{ zIndex: 9998 }}
              onClick={() => setMobileOpen(false)}
              role="button"
              tabIndex={-1}
              aria-label="Close menu"
            />
            <div
              id="mobile-menu"
              className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col gap-4 overflow-y-auto"
              style={{ zIndex: 9999 }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                <DealersDropdown isMobile={true} onNavigate={() => setMobileOpen(false)} />
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      pathname === href
                        ? "text-[#CB2030] bg-red-50"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => { setMobileOpen(false); setCpOpen(true); }}
                className="mt-auto flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2"
              >
                <Search className="w-4 h-4" /> Search Cars
              </button>
            </div>
          </>,
          document.body
        )}
      </header>

      <CarFilterSearch open={cpOpen} onClose={() => setCpOpen(false)} />
      {/* Spacer for fixed header (8px utility + 56px nav = 64px total) */}
      <div className="h-[86px]" aria-hidden />
    </>
  );
}
