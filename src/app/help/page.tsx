'use client';

import React, { useState, useId } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Search, ChevronDown, Car, CreditCard, Users, Shield, Phone,
  MessageCircle, HelpCircle, Settings, FileText, ArrowRight,
  Zap, CheckCircle, ChevronRight, X
} from 'lucide-react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
interface FAQItem { question: string; answer: string }
interface HelpCategory {
  id: string; title: string; icon: React.ElementType;
  description: string; count: number; color: string; faqs: FAQItem[];
}

const helpCategories: HelpCategory[] = [
  {
    id: 'buying', title: 'Buying a Car', icon: Car, count: 5,
    color: '#CB2030',
    description: 'Finding and purchasing your next vehicle',
    faqs: [
      { question: 'How do I search for cars on Cars.na?', answer: 'Use our search bar at the top of any page or browse by category. You can filter by make, model, year, price range, location, and more to find exactly what you\'re looking for.' },
      { question: 'How do I contact a seller or dealer?', answer: 'On each vehicle listing you\'ll find contact options including phone, WhatsApp, and a contact form. Click "Contact Dealer" or use the provided phone numbers to get in touch directly.' },
      { question: 'Can I schedule a test drive?', answer: 'Yes! Contact the dealer directly through the listing to arrange a test drive. Most dealers are happy to accommodate viewing appointments.' },
      { question: 'Are the prices negotiable?', answer: 'Pricing is set by individual dealers and sellers. Contact them directly to discuss pricing and any potential negotiations.' },
      { question: 'How do I know if a listing is legitimate?', answer: 'All dealer listings are verified. Look for the verified dealer badge, check dealer reviews, and always inspect the vehicle in person before making any payments.' },
    ],
  },
  {
    id: 'selling', title: 'Selling Your Car', icon: FileText, count: 5,
    color: '#F59E0B',
    description: 'Listing and selling your vehicle',
    faqs: [
      { question: 'How do I list my car for sale?', answer: 'Click "Sell Your Car" in the main navigation and follow our step-by-step wizard. You\'ll need photos, vehicle details, and contact information. Listing is free!' },
      { question: 'What information do I need to provide?', answer: 'You\'ll need vehicle details (make, model, year, mileage), condition information, photos, asking price, and your contact details.' },
      { question: 'How much does it cost to list my car?', answer: 'Basic listings are completely free. We may offer premium listing options in the future for enhanced visibility.' },
      { question: 'How long will my listing stay active?', answer: 'Listings remain active for 90 days. You can renew, edit, or remove your listing at any time by contacting us.' },
      { question: 'Can I edit my listing after it\'s published?', answer: 'Yes! Contact our support team with your listing details and the changes you\'d like to make.' },
    ],
  },
  {
    id: 'dealers', title: 'For Dealers', icon: Users, count: 5,
    color: '#10B981',
    description: 'Information for automotive dealers',
    faqs: [
      { question: 'How do I become a verified dealer?', answer: 'Visit our dealer registration page and complete the application. We\'ll verify your business credentials and set up your dealer account.' },
      { question: 'What are the benefits of being a verified dealer?', answer: 'Verified dealers get a badge, access to the dealer dashboard, inventory management tools, lead tracking, and enhanced listing visibility.' },
      { question: 'How much does dealer membership cost?', answer: 'We offer various dealer packages. Contact our dealer support team for current pricing and package details.' },
      { question: 'Can I manage multiple locations?', answer: 'Yes! Our dealer dashboard supports multiple locations and staff accounts under one dealership profile.' },
      { question: 'How do I track leads and inquiries?', answer: 'Your dealer dashboard includes a comprehensive lead management system where you can track all customer inquiries and follow up efficiently.' },
    ],
  },
  {
    id: 'financing', title: 'Financing', icon: CreditCard, count: 5,
    color: '#0EA5E9',
    description: 'Financing options and our calculator',
    faqs: [
      { question: 'Does Cars.na provide vehicle financing?', answer: 'No, Cars.na does not provide financing. We offer a financing calculator tool to help estimate payments. Apply for financing with your preferred bank or dealership.' },
      { question: 'How accurate is the financing calculator?', answer: 'Our calculator provides estimates based on current market rates from major Namibian banks. Actual rates may vary based on your credit profile and chosen lender.' },
      { question: 'Which banks offer vehicle financing in Namibia?', answer: 'Major banks including Bank Windhoek, FNB Namibia, Standard Bank, and Nedbank offer vehicle financing. Contact them directly for applications.' },
      { question: 'What documents do I need for vehicle financing?', answer: 'Typically you\'ll need ID, proof of income, bank statements, and vehicle details. Each bank has specific requirements — contact them for their complete list.' },
      { question: 'Can I get pre-approved for financing?', answer: 'Yes! Contact banks directly for pre-approval. This can help you understand your budget before shopping for vehicles.' },
    ],
  },
  {
    id: 'safety', title: 'Safety & Trust', icon: Shield, count: 5,
    color: '#8B5CF6',
    description: 'Staying safe buying and selling online',
    faqs: [
      { question: 'How can I avoid scams when buying a car?', answer: 'Always inspect vehicles in person, verify dealer credentials, never send money before seeing the car, and be cautious of deals that seem too good to be true.' },
      { question: 'What should I do if I encounter a suspicious listing?', answer: 'Report suspicious listings to our safety team immediately. Use the "Report" button on listings or contact us directly.' },
      { question: 'Is it safe to meet sellers in person?', answer: 'Yes, but take precautions: meet in public places, bring a friend, inspect during daylight hours, and trust your instincts.' },
      { question: 'How do I verify a dealer is legitimate?', answer: 'Look for the verified dealer badge, check their business registration, read reviews, and visit their physical location if possible.' },
      { question: 'What payment methods are safest?', answer: 'Bank transfers and verified payment methods are safest. Avoid cash for large amounts and never pay before inspecting the vehicle.' },
    ],
  },
  {
    id: 'technical', title: 'Technical Support', icon: Settings, count: 5,
    color: '#6B7280',
    description: 'Website help and account issues',
    faqs: [
      { question: 'Why can\'t I see vehicle images?', answer: 'This might be due to slow internet or browser issues. Try refreshing the page, clearing your browser cache, or using a different browser.' },
      { question: 'The search isn\'t working properly. What should I do?', answer: 'Try clearing your search filters and starting fresh. If problems persist, contact our technical support team.' },
      { question: 'How do I reset my dealer account password?', answer: 'Use the "Forgot Password" link on the login page, or contact our support team for assistance with account recovery.' },
      { question: 'Can I use Cars.na on my mobile phone?', answer: 'Yes! Our website is fully responsive and works great on mobile devices. We may also launch a mobile app in the future.' },
      { question: 'Why is the website running slowly?', answer: 'This could be due to internet connectivity or high traffic. Try refreshing the page or accessing the site at a different time.' },
    ],
  },
];

const CONTACT_ITEMS = [
  { href: '/contact', icon: MessageCircle, label: 'Contact Support', desc: 'Get help from our team', color: '#CB2030' },
  { href: 'tel:+264814494433', icon: Phone, label: 'Call Us', desc: '+264 81 449 4433', color: '#10B981' },
  { href: 'https://wa.me/264814494433', icon: Zap, label: 'WhatsApp', desc: 'Daily, 8am – 8pm', color: '#25D366', external: true },
] as const;

/* ─────────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────────── */
function AccordionItem({
  faq, index, catId, color, open, onToggle,
}: {
  faq: FAQItem; index: number; catId: string; color: string;
  open: boolean; onToggle: () => void;
}) {
  const id = `${catId}-${index}`;
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        id={`btn-${id}`}
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        onClick={onToggle}
        className="w-full flex items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-gray-50/60 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        style={{ ['--tw-ring-color' as string]: color + '60' }}
      >
        <span
          className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ background: open ? color : '#F3F4F6' }}
          aria-hidden="true"
        >
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{
              color: open ? '#fff' : '#9CA3AF',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </span>
        <span className={`flex-1 text-sm leading-relaxed transition-colors ${open ? 'text-gray-900 font-semibold' : 'text-gray-700 font-medium group-hover:text-gray-900'}`}>
          {faq.question}
        </span>
      </button>

      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`btn-${id}`}
        hidden={!open}
        className="overflow-hidden"
      >
        <div className="pb-5 px-6 pl-[3.75rem]">
          <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const searchId = useId();

  const isSearching = searchQuery.trim().length > 0;
  const isBrowsing = !isSearching && activeCategory !== null;

  /* Filter results */
  const searchResults = isSearching
    ? helpCategories.flatMap(cat =>
        cat.faqs
          .filter(f =>
            f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(faq => ({ faq, cat }))
      )
    : [];

  const activeCat = isBrowsing
    ? helpCategories.find(c => c.id === activeCategory) ?? null
    : null;

  const toggleFAQ = (key: string) =>
    setExpandedFAQ(prev => (prev === key ? null : key));

  const handleCategoryClick = (id: string) => {
    setActiveCategory(prev => (prev === id ? null : id));
    setExpandedFAQ(null);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setExpandedFAQ(null);
  };

  return (
    <MainLayout>
      {/* ── HERO / SEARCH ─────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.5,
          }}
        />
        {/* Red accent bar top */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#CB2030' }} aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4" style={{ color: '#CB2030' }} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#CB2030' }}>
                Help Center
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              How can we help you?
            </h1>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Search our knowledge base or browse by category — we&apos;ve got answers to the most common questions about buying, selling, and dealing on Cars.na.
            </p>

            {/* Search bar */}
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">Search help topics</label>
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                placeholder="Search for topics, questions, or keywords…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveCategory(null); setExpandedFAQ(null); }}
                className="w-full pl-11 pr-12 py-3.5 text-sm border border-gray-200 rounded-2xl bg-white placeholder-gray-400 text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ ['--tw-ring-color' as string]: '#CB2030' }}
                autoComplete="off"
              />
              {isSearching && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-gray-100">
            {[
              { value: '6', label: 'Topics covered' },
              { value: '30+', label: 'Answered questions' },
              { value: '24h', label: 'Support response' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BODY ────────────────────────────────────── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-8">

          {/* ── SEARCH RESULTS ─────────────────────── */}
          {isSearching && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {searchResults.length > 0 ? (
                  <>Found <strong className="text-gray-900">{searchResults.length}</strong> result{searchResults.length !== 1 ? 's' : ''} for &ldquo;<strong className="text-gray-900">{searchQuery}</strong>&rdquo;</>
                ) : (
                  <>No results for &ldquo;<strong className="text-gray-900">{searchQuery}</strong>&rdquo;</>
                )}
              </p>

              {searchResults.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-5 h-5 text-gray-300" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Nothing found</p>
                  <p className="text-xs text-gray-400 mb-5">Try different keywords, or browse a category below</p>
                  <button
                    onClick={clearSearch}
                    className="text-xs font-bold hover:underline cursor-pointer"
                    style={{ color: '#CB2030' }}
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map(({ faq, cat }, i) => {
                    const key = `search-${i}`;
                    const open = expandedFAQ === key;
                    return (
                      <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Category badge */}
                        <div className="flex items-center gap-2 px-6 pt-4 pb-0">
                          <div
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: cat.color + '15', color: cat.color }}
                          >
                            <cat.icon className="w-3 h-3" aria-hidden="true" />
                            {cat.title}
                          </div>
                        </div>
                        <AccordionItem
                          faq={faq} index={i} catId="search" color={cat.color}
                          open={open} onToggle={() => toggleFAQ(key)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CONTACT STRIP ──────────────────────── */}
          {!isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTACT_ITEMS.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={'external' in item && item.external ? '_blank' : undefined}
                    rel={'external' in item && item.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: item.color + '15' }}
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#CB2030] transition-colors">{item.label}</p>
                      <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#CB2030] shrink-0 transition-colors" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          )}

          {/* ── CATEGORY GRID ──────────────────────── */}
          {!isSearching && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Browse by topic</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {helpCategories.map(cat => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      aria-pressed={active}
                      className="group flex flex-col items-start gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2"
                      style={{
                        background: active ? cat.color + '08' : '#fff',
                        borderColor: active ? cat.color + '40' : '#F3F4F6',
                        boxShadow: active ? `0 0 0 2px ${cat.color}20` : '0 1px 3px 0 rgba(0,0,0,0.04)',
                        ['--tw-ring-color' as string]: cat.color + '60',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ background: active ? cat.color + '20' : '#F9FAFB' }}
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 transition-colors" style={{ color: active ? cat.color : '#6B7280' }} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold transition-colors ${active ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {cat.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{cat.description}</p>
                      </div>
                      <div className="flex items-center justify-between w-full mt-auto pt-1">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: cat.color + '15', color: cat.color }}
                        >
                          {cat.count} questions
                        </span>
                        <ChevronRight
                          className="w-3.5 h-3.5 transition-all"
                          style={{ color: active ? cat.color : '#D1D5DB', transform: active ? 'rotate(90deg)' : 'rotate(0deg)' }}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ACTIVE CATEGORY FAQ ─────────────────── */}
          {!isSearching && activeCat && (
            <div>
              {/* Category header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: activeCat.color + '15' }}
                    aria-hidden="true"
                  >
                    <activeCat.icon className="w-4 h-4" style={{ color: activeCat.color }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{activeCat.title}</h2>
                    <p className="text-xs text-gray-400">{activeCat.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveCategory(null); setExpandedFAQ(null); }}
                  aria-label="Close category"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>

              {/* FAQ list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {activeCat.faqs.map((faq, i) => {
                  const key = `${activeCat.id}-${i}`;
                  return (
                    <AccordionItem
                      key={key} faq={faq} index={i} catId={activeCat.id}
                      color={activeCat.color} open={expandedFAQ === key}
                      onToggle={() => toggleFAQ(key)}
                    />
                  );
                })}
              </div>

              {/* Helpful? */}
              <p className="text-xs text-gray-400 text-center mt-4">
                Didn&apos;t find what you&apos;re looking for?{' '}
                <Link href="/contact" className="font-semibold hover:underline" style={{ color: '#CB2030' }}>
                  Contact support
                </Link>
              </p>
            </div>
          )}

          {/* ── NO CATEGORY SELECTED — POPULAR Qs ─── */}
          {!isSearching && !activeCategory && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Popular questions</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {helpCategories.slice(0, 2).flatMap(cat =>
                  cat.faqs.slice(0, 2).map((faq, i) => {
                    const key = `popular-${cat.id}-${i}`;
                    return (
                      <AccordionItem
                        key={key} faq={faq} index={i} catId={`popular-${cat.id}`}
                        color={cat.color} open={expandedFAQ === key}
                        onToggle={() => toggleFAQ(key)}
                      />
                    );
                  })
                )}
              </div>
              <div className="text-center mt-3">
                <p className="text-xs text-gray-400">
                  Browse a category above to see all questions
                </p>
              </div>
            </div>
          )}

          {/* ── TRUST BADGES ───────────────────────── */}
          {!isSearching && !activeCategory && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: CheckCircle, title: 'Verified Dealers', desc: 'All dealerships are vetted before listing on Cars.na', color: '#10B981' },
                { icon: Shield, title: 'Safe Transactions', desc: 'Tips and tools to keep your purchase secure', color: '#8B5CF6' },
                { icon: Car, title: 'Quality Listings', desc: 'Thousands of vehicles across Namibia', color: '#CB2030' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: item.color + '12' }}
                    aria-hidden="true"
                  >
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400 leading-snug mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── BOTTOM CTA ─────────────────────────── */}
          <div className="rounded-2xl overflow-hidden bg-gray-900">
            <div className="px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Still need help?</p>
                <h3 className="text-lg font-bold text-white mb-1">Can&apos;t find what you&apos;re looking for?</h3>
                <p className="text-sm text-gray-400">Our support team is available to help — reach out any time.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://wa.me/264814494433"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors"
                >
                  <Zap className="w-4 h-4" style={{ color: '#25D366' }} aria-hidden="true" />
                  WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#CB2030' }}
                >
                  Contact Support <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
