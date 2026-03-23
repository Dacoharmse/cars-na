'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/Toast';
import {
  Globe, Building2, Phone, Mail, MapPin, Share2, Save, ExternalLink,
  AlertCircle, Facebook, Instagram, Twitter, Linkedin, User, MessageCircle,
  Link, FileText, Tag, Hash, Clock, Sparkles, Eye, Image as ImageIcon,
  CheckCircle, ChevronRight, RotateCcw, Copy, Check, Zap, Shield,
  TrendingUp, Calendar,
} from 'lucide-react';

// ─── Brand ───────────────────────────────────────────────────────────────────

const NAVY = '#1F3469';
const RED = '#CB2030';
const GREEN = '#109B4A';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DealershipData {
  id?: string;
  name?: string;
  slug?: string;
  businessType?: string;
  contactPerson?: string;
  description?: string;
  specializations?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  whatsappNumber?: string;
  website?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  googleMapsUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  logo?: string;
  coverImage?: string;
  openingHours?: string;
  highlightTitle?: string;
  highlightDescription?: string;
  highlightActive?: boolean;
  isVerified?: boolean;
  profileViews?: number;
  responseTime?: string;
  _count?: { vehicles: number; users: number };
}

type DaySchedule = { open: string; close: string; closed: boolean };
type WeekSchedule = Record<string, DaySchedule>;

const DEFAULT_HOURS: WeekSchedule = {
  Monday:    { open: '08:00', close: '17:00', closed: false },
  Tuesday:   { open: '08:00', close: '17:00', closed: false },
  Wednesday: { open: '08:00', close: '17:00', closed: false },
  Thursday:  { open: '08:00', close: '17:00', closed: false },
  Friday:    { open: '08:00', close: '17:00', closed: false },
  Saturday:  { open: '08:00', close: '13:00', closed: false },
  Sunday:    { open: '08:00', close: '13:00', closed: true },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TABS = [
  { id: 'profile',  label: 'Profile',        icon: Building2 },
  { id: 'contact',  label: 'Contact',         icon: Phone },
  { id: 'location', label: 'Location',        icon: MapPin },
  { id: 'hours',    label: 'Hours & Offers',  icon: Clock },
  { id: 'social',   label: 'Social',          icon: Share2 },
  { id: 'branding', label: 'Branding',        icon: ImageIcon },
] as const;

type TabId = typeof TABS[number]['id'];

const REGIONS = [
  'Erongo', 'Hardap', 'Karas', 'Kavango East', 'Kavango West',
  'Khomas', 'Kunene', 'Ohangwena', 'Omaheke', 'Omusati',
  'Oshana', 'Oshikoto', 'Otjozondjupa', 'Zambezi',
];

const BUSINESS_TYPES = [
  'New & Used Vehicles', 'Used Vehicles Only', 'New Vehicles Only',
  'Motorcycles', 'Commercial Vehicles', 'Luxury & Exotic',
  'Electric Vehicles', 'Fleet & Rental', 'Parts & Accessories', 'Other',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseHours(raw?: string): WeekSchedule {
  if (!raw) return { ...DEFAULT_HOURS };
  try { return JSON.parse(raw); } catch { return { ...DEFAULT_HOURS }; }
}

function serializeHours(schedule: WeekSchedule): string {
  return JSON.stringify(schedule);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldInput({
  icon: Icon, value, onChange, placeholder, type = 'text', prefix, disabled,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; prefix?: string; disabled?: boolean;
}) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Icon size={15} className="text-slate-400 group-focus-within:text-[#1F3469] transition-colors" />
        </div>
      )}
      {prefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <span className="text-slate-400 text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm h-10 pr-3 transition-all
          focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
          placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400
          ${Icon ? 'pl-10' : prefix ? 'pl-9' : 'pl-3.5'}`}
      />
    </div>
  );
}

function FieldSelect({
  icon: Icon, value, onChange, options, placeholder,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
          <Icon size={15} className="text-slate-400 group-focus-within:text-[#1F3469] transition-colors" />
        </div>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm h-10 pr-8 transition-all
          focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
          appearance-none cursor-pointer
          ${Icon ? 'pl-10' : 'pl-3.5'} ${!value ? 'text-slate-300' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function SocialField({
  icon: Icon, iconColor, label, value, onChange, placeholder,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  iconColor: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-white">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${iconColor}12` }}>
        <Icon size={16} className="flex-shrink-0" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder:text-slate-300"
        />
      </div>
      {value && (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all flex-shrink-0">
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

function ProfileCompleteness({ dealership }: { dealership: DealershipData }) {
  const fields = [
    { key: 'name', weight: 15 },
    { key: 'description', weight: 10 },
    { key: 'phone', weight: 10 },
    { key: 'email', weight: 10 },
    { key: 'city', weight: 8 },
    { key: 'region', weight: 5 },
    { key: 'streetAddress', weight: 8 },
    { key: 'businessType', weight: 5 },
    { key: 'contactPerson', weight: 5 },
    { key: 'specializations', weight: 4 },
    { key: 'whatsappNumber', weight: 5 },
    { key: 'facebookUrl', weight: 3 },
    { key: 'instagramUrl', weight: 3 },
    { key: 'openingHours', weight: 5 },
    { key: 'logo', weight: 2 },
    { key: 'coverImage', weight: 2 },
  ];
  const total = fields.reduce((s, f) => s + f.weight, 0);
  const filled = fields.reduce((s, f) => {
    const val = dealership[f.key as keyof DealershipData];
    return s + (val && String(val).trim() ? f.weight : 0);
  }, 0);
  const pct = Math.round((filled / total) * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 80 ? GREEN : pct >= 50 ? '#F59E0B' : RED;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-800">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">Profile Completeness</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {pct >= 80 ? 'Your profile looks great!' : pct >= 50 ? 'Add more details to stand out' : 'Complete your profile to attract customers'}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string; value: string | number; color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}10` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function SkeletonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-7 w-48 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-72 bg-slate-100 rounded mb-8" />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-lg" />)}
      </div>
      <div className="flex gap-1 mb-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 w-24 bg-slate-100 rounded-lg" />)}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i}>
            <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
            <div className="h-10 w-full bg-slate-50 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WebsiteManager() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();

  const [dealership, setDealership] = useState<DealershipData>({});
  const [original, setOriginal]     = useState<DealershipData>({});
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [activeTab, setActiveTab]   = useState<TabId>('profile');
  const [hours, setHours]           = useState<WeekSchedule>(DEFAULT_HOURS);
  const [slugCopied, setSlugCopied] = useState(false);

  const isDirty = JSON.stringify(dealership) !== JSON.stringify(original);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { window.location.href = '/dealer/login'; return; }
    fetchDealership();
  }, [session, status]);

  const fetchDealership = async () => {
    try {
      const res = await fetch('/api/dealer/dealership');
      const data = await res.json();
      if (data.success && data.dealership) {
        setDealership(data.dealership);
        setOriginal(data.dealership);
        setHours(parseHours(data.dealership.openingHours));
      } else {
        showToast({ title: data.error || 'Failed to load dealership', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Failed to load dealership data', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...dealership,
        openingHours: serializeHours(hours),
      };
      const res = await fetch('/api/dealer/dealership', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast({ title: 'Changes saved successfully!', variant: 'success' });
        setDealership(data.dealership);
        setOriginal(data.dealership);
      } else {
        showToast({ title: data.error || 'Failed to update', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Failed to save changes', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const set = useCallback((field: keyof DealershipData) =>
    (value: string | boolean) => setDealership(prev => ({ ...prev, [field]: value })),
  []);

  const slugPreview = dealership.slug
    ? `cars.na/dealership/${dealership.slug}`
    : 'cars.na/dealership/your-slug';

  const copySlug = () => {
    if (dealership.slug) {
      navigator.clipboard.writeText(`https://cars.na/dealership/${dealership.slug}`);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    }
  };

  const updateDay = (day: string, field: keyof DaySchedule, val: string | boolean) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: val } }));
    setDealership(prev => ({ ...prev, openingHours: serializeHours({ ...hours, [day]: { ...hours[day], [field]: val } }) }));
  };

  // Tab completion indicators
  const tabComplete = useMemo(() => ({
    profile:  !!(dealership.name && dealership.description && dealership.businessType),
    contact:  !!(dealership.phone && dealership.email),
    location: !!(dealership.city && dealership.region),
    hours:    !!(dealership.openingHours),
    social:   !!(dealership.facebookUrl || dealership.instagramUrl),
    branding: !!(dealership.logo || dealership.coverImage),
  }), [dealership]);

  if (loading) return <MainLayout><SkeletonPage /></MainLayout>;

  if (!dealership.id) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <AlertCircle size={32} className="text-red-400" />
          <p className="font-semibold text-slate-700">No dealership found</p>
          <p className="text-sm text-slate-400">Please contact support</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Website Manager</h1>
              {dealership.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-semibold text-green-700">
                  <Shield size={10} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Manage your public dealership profile on Cars.na
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {dealership.slug && (
              <a href={`/dealership/${dealership.slug}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                  text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
                <ExternalLink size={13} /> Preview
              </a>
            )}
            <button onClick={handleSave} disabled={saving || !isDirty}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white
                transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: NAVY }}>
              {saving ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : <Save size={14} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* ── Stats row + completeness ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="sm:col-span-2 lg:col-span-1 p-3 rounded-lg border border-slate-100 bg-white">
            <ProfileCompleteness dealership={dealership} />
          </div>
          <StatCard icon={Eye} label="Profile Views" value={dealership.profileViews ?? 0} color={NAVY} />
          <StatCard icon={TrendingUp} label="Active Listings" value={dealership._count?.vehicles ?? 0} color={GREEN} />
          <StatCard icon={Clock} label="Response Time" value={dealership.responseTime ?? '< 1 hour'} color="#F59E0B" />
        </div>

        {/* ── Unsaved changes banner ───────────────────────────────────── */}
        {isDirty && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-5
            animate-[fadeIn_200ms_ease-out]">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              You have unsaved changes
            </div>
            <button onClick={() => { setDealership(original); setHours(parseHours(original.openingHours)); }}
              className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-1">
              <RotateCcw size={11} /> Discard
            </button>
          </div>
        )}

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-0.5 bg-slate-100/80 rounded-lg p-1 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const complete = tabComplete[tab.id];
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer
                  ${active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
                {complete && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Building2 size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Business Information</h2>
              </div>

              <div>
                <FieldLabel required>Dealership Name</FieldLabel>
                <FieldInput icon={Building2} value={dealership.name || ''} onChange={set('name')} placeholder="e.g. Windhoek Auto Centre" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Business Type</FieldLabel>
                  <FieldSelect icon={Tag} value={dealership.businessType || ''} onChange={set('businessType')}
                    options={BUSINESS_TYPES} placeholder="Select business type…" />
                </div>
                <div>
                  <FieldLabel>Contact Person</FieldLabel>
                  <FieldInput icon={User} value={dealership.contactPerson || ''} onChange={set('contactPerson')} placeholder="e.g. John Smith" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>About Your Dealership</FieldLabel>
                  <span className="text-[11px] text-slate-400 tabular-nums font-mono">
                    {(dealership.description || '').length}/500
                  </span>
                </div>
                <textarea value={dealership.description || ''}
                  onChange={e => set('description')(e.target.value)} maxLength={500} rows={4}
                  placeholder="Tell customers what makes your dealership special — your history, values, and what you offer…"
                  className="w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm py-2.5 px-3.5
                    transition-all focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
                    placeholder:text-slate-300 resize-none" />
              </div>

              <div>
                <FieldLabel>Specializations</FieldLabel>
                <FieldInput icon={FileText} value={dealership.specializations || ''} onChange={set('specializations')}
                  placeholder="e.g. Luxury Cars, SUVs, 4x4 Vehicles" />
                <p className="text-[11px] text-slate-400 mt-1.5">Separate multiple specializations with commas</p>
              </div>

              <div>
                <FieldLabel>Profile URL Slug</FieldLabel>
                <FieldInput icon={Hash} value={dealership.slug || ''} onChange={set('slug')} placeholder="windhoek-auto-centre" />
                <div className="flex items-center gap-2 mt-1.5">
                  <Link size={11} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400 font-mono flex-1">{slugPreview}</span>
                  <button onClick={copySlug}
                    className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 cursor-pointer">
                    {slugCopied ? <><Check size={10} className="text-green-500" /> Copied</> : <><Copy size={10} /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact tab */}
          {activeTab === 'contact' && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Phone size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Primary Phone</FieldLabel>
                  <FieldInput icon={Phone} value={dealership.phone || ''} onChange={set('phone')} placeholder="+264 81 123 4567" type="tel" />
                </div>
                <div>
                  <FieldLabel>Alternate Phone</FieldLabel>
                  <FieldInput icon={Phone} value={dealership.alternatePhone || ''} onChange={set('alternatePhone')} placeholder="+264 81 123 4567" type="tel" />
                </div>
              </div>

              <div>
                <FieldLabel required>Email Address</FieldLabel>
                <FieldInput icon={Mail} value={dealership.email || ''} onChange={set('email')} placeholder="info@yourdealership.na" type="email" />
              </div>

              <div>
                <FieldLabel>WhatsApp Number</FieldLabel>
                <FieldInput icon={MessageCircle} value={dealership.whatsappNumber || ''} onChange={set('whatsappNumber')} placeholder="+264 81 123 4567" type="tel" />
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <MessageCircle size={10} /> Customers can reach you directly on WhatsApp from your profile
                </p>
              </div>

              <div>
                <FieldLabel>Website</FieldLabel>
                <FieldInput icon={Globe} value={dealership.website || ''} onChange={set('website')} placeholder="www.yourdealership.na" type="url" />
              </div>
            </div>
          )}

          {/* Location tab */}
          {activeTab === 'location' && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Location & Address</h2>
              </div>

              <div>
                <FieldLabel>Street Address</FieldLabel>
                <FieldInput icon={MapPin} value={dealership.streetAddress || ''} onChange={set('streetAddress')} placeholder="e.g. 123 Independence Avenue" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>City / Town</FieldLabel>
                  <FieldInput value={dealership.city || ''} onChange={set('city')} placeholder="e.g. Windhoek" />
                </div>
                <div>
                  <FieldLabel>Region</FieldLabel>
                  <FieldSelect value={dealership.region || ''} onChange={set('region')}
                    options={REGIONS} placeholder="Select region…" />
                </div>
              </div>

              <div className="sm:w-1/3">
                <FieldLabel>Postal Code</FieldLabel>
                <FieldInput value={dealership.postalCode || ''} onChange={set('postalCode')} placeholder="e.g. 10001" />
              </div>

              <div>
                <FieldLabel>Google Maps Link</FieldLabel>
                <FieldInput icon={MapPin} value={dealership.googleMapsUrl || ''} onChange={set('googleMapsUrl')}
                  placeholder="https://maps.google.com/..." type="url" />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Paste your Google Maps share link so customers can get directions
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Why location matters</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Accurate location information helps customers find your dealership and improves visibility in regional searches on Cars.na.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hours & Offers tab */}
          {activeTab === 'hours' && (
            <div className="p-5 sm:p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Business Hours</h2>
              </div>

              <div className="space-y-2">
                {DAYS.map(day => (
                  <div key={day} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors
                    ${hours[day]?.closed
                      ? 'border-slate-100 bg-slate-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className="w-24 flex-shrink-0">
                      <span className={`text-sm font-medium ${hours[day]?.closed ? 'text-slate-400' : 'text-slate-700'}`}>{day}</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                      <input type="checkbox" checked={!hours[day]?.closed}
                        onChange={e => updateDay(day, 'closed', !e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-[#1F3469]" />
                      <span className="text-xs text-slate-500">{hours[day]?.closed ? 'Closed' : 'Open'}</span>
                    </label>
                    {!hours[day]?.closed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <input type="time" value={hours[day]?.open || '08:00'}
                          onChange={e => updateDay(day, 'open', e.target.value)}
                          className="text-sm border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20" />
                        <span className="text-xs text-slate-400">to</span>
                        <input type="time" value={hours[day]?.close || '17:00'}
                          onChange={e => updateDay(day, 'close', e.target.value)}
                          className="text-sm border border-slate-200 rounded-md px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Special Offer / Highlight */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 pb-3">
                  <Sparkles size={16} style={{ color: '#F59E0B' }} />
                  <h2 className="text-sm font-bold text-slate-800">Special Offer / Highlight</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Show a special offer or promotion on your public dealership page to attract customers.
                </p>

                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox"
                      checked={dealership.highlightActive || false}
                      onChange={e => set('highlightActive')(e.target.checked as unknown as string)}
                      className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-[#1F3469] rounded-full transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">Show special offer on profile</span>
                </label>

                {dealership.highlightActive && (
                  <div className="space-y-4 animate-[fadeIn_200ms_ease-out]">
                    <div>
                      <FieldLabel>Offer Title</FieldLabel>
                      <FieldInput icon={Zap} value={dealership.highlightTitle || ''} onChange={set('highlightTitle')}
                        placeholder="e.g. Summer Sale - 10% Off All SUVs" />
                    </div>
                    <div>
                      <FieldLabel>Offer Description</FieldLabel>
                      <textarea value={dealership.highlightDescription || ''}
                        onChange={e => set('highlightDescription')(e.target.value)} maxLength={200} rows={2}
                        placeholder="Brief description of your special offer…"
                        className="w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm py-2.5 px-3.5
                          transition-all focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
                          placeholder:text-slate-300 resize-none" />
                    </div>

                    {/* Preview */}
                    {dealership.highlightTitle && (
                      <div className="bg-gradient-to-r from-amber-50 to-amber-25 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={14} className="text-amber-600" />
                          <span className="text-sm font-bold text-amber-800">{dealership.highlightTitle}</span>
                        </div>
                        {dealership.highlightDescription && (
                          <p className="text-xs text-amber-700 ml-6">{dealership.highlightDescription}</p>
                        )}
                        <p className="text-[10px] text-amber-500 mt-2 ml-6">Preview — this is how it appears on your profile</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social tab */}
          {activeTab === 'social' && (
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Share2 size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Social Media Profiles</h2>
              </div>

              <p className="text-xs text-slate-500">
                Add your social media profiles. Customers will see links to these on your public dealership page.
              </p>

              <div className="space-y-3">
                <SocialField icon={Facebook} iconColor="#1877F2" label="Facebook Page"
                  value={dealership.facebookUrl || ''} onChange={set('facebookUrl')}
                  placeholder="https://facebook.com/yourdealership" />

                <SocialField icon={Instagram} iconColor="#E1306C" label="Instagram"
                  value={dealership.instagramUrl || ''} onChange={set('instagramUrl')}
                  placeholder="https://instagram.com/yourdealership" />

                <SocialField icon={Twitter} iconColor="#1DA1F2" label="X / Twitter"
                  value={dealership.twitterUrl || ''} onChange={set('twitterUrl')}
                  placeholder="https://x.com/yourdealership" />

                <SocialField icon={Linkedin} iconColor="#0A66C2" label="LinkedIn"
                  value={dealership.linkedinUrl || ''} onChange={set('linkedinUrl')}
                  placeholder="https://linkedin.com/company/yourdealership" />
              </div>
            </div>
          )}

          {/* Branding tab */}
          {activeTab === 'branding' && (
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ImageIcon size={16} style={{ color: NAVY }} />
                <h2 className="text-sm font-bold text-slate-800">Branding & Images</h2>
              </div>

              <p className="text-xs text-slate-500 mb-2">
                Upload your dealership logo and cover image to make your profile stand out.
              </p>

              {/* Logo */}
              <div>
                <FieldLabel>Logo URL</FieldLabel>
                <FieldInput icon={ImageIcon} value={dealership.logo || ''} onChange={set('logo')}
                  placeholder="https://example.com/your-logo.png" type="url" />
                {dealership.logo && (
                  <div className="mt-3 p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white flex items-center justify-center">
                      <img src={dealership.logo} alt="Logo preview" className="max-w-full max-h-full object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-600">Logo Preview</p>
                      <p className="text-[11px] text-slate-400">Recommended: 200×200px, PNG or SVG</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <FieldLabel>Cover Image URL</FieldLabel>
                <FieldInput icon={ImageIcon} value={dealership.coverImage || ''} onChange={set('coverImage')}
                  placeholder="https://example.com/your-banner.jpg" type="url" />
                {dealership.coverImage && (
                  <div className="mt-3 border border-slate-100 rounded-lg overflow-hidden bg-slate-50">
                    <div className="w-full h-32 overflow-hidden">
                      <img src={dealership.coverImage} alt="Cover preview" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-slate-600">Cover Image Preview</p>
                      <p className="text-[11px] text-slate-400">Recommended: 1200×400px, JPG or PNG</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
                <div className="flex items-start gap-3">
                  <ImageIcon size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Image tips</p>
                    <ul className="text-xs text-blue-600 space-y-1 leading-relaxed">
                      <li>Use a high-quality logo with transparent background</li>
                      <li>Cover images should showcase your dealership or best vehicles</li>
                      <li>Images are displayed on your public profile page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom save bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {isDirty ? (
              <button onClick={() => { setDealership(original); setHours(parseHours(original.openingHours)); }}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5">
                <RotateCcw size={13} /> Discard changes
              </button>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-400" /> All changes saved
              </span>
            )}
          </div>
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white
              transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: NAVY }}>
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

      </div>
    </MainLayout>
  );
}
