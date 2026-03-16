import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#080C18] text-white overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#1F3469]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-4 pt-16 pb-8">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand — wider column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-5 hover:opacity-80 transition-opacity">
              <Image
                src="/cars-na-logo.png"
                alt="Cars.na Logo"
                width={140}
                height={46}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xs">
              Namibia&apos;s trusted marketplace for buying and selling quality vehicles. Connecting buyers with verified dealers since 2021.
            </p>
            <div className="flex items-center gap-4">
              {[
                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] hover:border-white/15 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/vehicles', label: 'Browse Cars' },
                { href: '/sell', label: 'Sell Your Car' },
                { href: '/financing', label: 'Financing' },
                { href: '/dealers', label: 'Find Dealers' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/35 hover:text-[#C9A84C] transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { href: '/help', label: 'Help Center' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/about', label: 'About Us' },
                { href: '/advertise', label: 'Advertise With Us', accent: true },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.accent
                      ? 'text-sm text-[#C9A84C] hover:text-[#D4B65C] font-medium transition-colors duration-200'
                      : 'text-sm text-white/35 hover:text-[#C9A84C] transition-colors duration-200'
                    }
                  >{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em] mb-5">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/cookies', label: 'Cookie Policy' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/35 hover:text-[#C9A84C] transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Cars.na. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <span>Built with</span>
            <span className="text-white/35 font-medium">Next.js</span>
            <span className="text-white/10">&bull;</span>
            <span className="text-white/35 font-medium">Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
