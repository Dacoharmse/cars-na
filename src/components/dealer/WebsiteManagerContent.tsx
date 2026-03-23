'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/Toast';
import {
  Save, Globe, Copy, CheckCircle, Facebook, Instagram, Twitter, Linkedin,
  Phone, Mail, MapPin, Clock, Upload, ExternalLink, Building2, User,
  FileText, Tag, Hash, Link, Share2, Sparkles, Zap, Shield, Eye,
  TrendingUp, RotateCcw, Check, Image as ImageIcon, AlertCircle,
} from 'lucide-react';

// ─── Brand ───────────────────────────────────────────────────────────────────
const NAVY = '#1F3469';
const GREEN = '#109B4A';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProfileData {
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
  status?: string;
  _count?: { vehicles: number; users: number };
}

type DaySchedule = { open: string; close: string; closed: boolean };
type WeekSchedule = Record<string, DaySchedule>;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_HOURS: WeekSchedule = {
  Monday:    { open: '08:00', close: '17:00', closed: false },
  Tuesday:   { open: '08:00', close: '17:00', closed: false },
  Wednesday: { open: '08:00', close: '17:00', closed: false },
  Thursday:  { open: '08:00', close: '17:00', closed: false },
  Friday:    { open: '08:00', close: '17:00', closed: false },
  Saturday:  { open: '08:00', close: '13:00', closed: false },
  Sunday:    { open: '08:00', close: '13:00', closed: true },
};

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

const TABS = [
  { id: 'profile',  label: 'Profile',   icon: Building2 },
  { id: 'contact',  label: 'Contact',   icon: Phone },
  { id: 'location', label: 'Location',  icon: MapPin },
  { id: 'hours',    label: 'Hours',     icon: Clock },
  { id: 'social',   label: 'Social',    icon: Share2 },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseHours(raw?: string): WeekSchedule {
  if (!raw) return { ...DEFAULT_HOURS };
  try {
    const parsed = JSON.parse(raw);
    // Validate it looks like a week schedule
    if (parsed && typeof parsed === 'object' && ('Monday' in parsed || 'Friday' in parsed)) {
      return parsed;
    }
  } catch {}
  return { ...DEFAULT_HOURS };
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Field({
  icon: Icon, value, onChange, placeholder, type = 'text', disabled,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon size={14} className="text-slate-400 group-focus-within:text-[#1F3469] transition-colors" />
        </div>
      )}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className={`w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm h-9 pr-3
          focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
          placeholder:text-slate-300 disabled:bg-slate-50 disabled:text-slate-400 transition-all
          ${Icon ? 'pl-9' : 'pl-3'}`} />
    </div>
  );
}

function FieldSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full border border-slate-200 rounded-lg bg-white text-sm h-9 pr-8 pl-3
          focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
          appearance-none cursor-pointer transition-all ${!value ? 'text-slate-300' : 'text-slate-800'}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function SocialRow({
  icon: Icon, iconColor, label, value, onChange, placeholder,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  iconColor: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${iconColor}14` }}>
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <input type="url" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full text-sm text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder:text-slate-300" />
      </div>
      {value && (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex-shrink-0">
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

function CompletenessRing({ data }: { data: ProfileData }) {
  const fields = [
    { key: 'name', w: 15 }, { key: 'description', w: 10 }, { key: 'phone', w: 10 },
    { key: 'email', w: 10 }, { key: 'city', w: 8 }, { key: 'region', w: 5 },
    { key: 'streetAddress', w: 7 }, { key: 'businessType', w: 5 },
    { key: 'whatsappNumber', w: 5 }, { key: 'facebookUrl', w: 3 },
    { key: 'openingHours', w: 5 }, { key: 'logo', w: 7 }, { key: 'coverImage', w: 5 },
    { key: 'specializations', w: 3 }, { key: 'googleMapsUrl', w: 2 },
  ];
  const total = fields.reduce((s, f) => s + f.w, 0);
  const filled = fields.reduce((s, f) => {
    const val = data[f.key as keyof ProfileData];
    return s + (val && String(val).trim() ? f.w : 0);
  }, 0);
  const pct = Math.round((filled / total) * 100);
  const r = 22, c = 2 * Math.PI * r;
  const color = pct >= 80 ? GREEN : pct >= 50 ? '#F59E0B' : '#CB2030';
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
          <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-800">{pct}%</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-700">Profile Complete</p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
          {pct >= 80 ? 'Looking great!' : pct >= 50 ? 'Add more details' : 'Complete to attract customers'}
        </p>
      </div>
    </div>
  );
}

function ImageUploadBox({
  label, hint, imageUrl, uploading, onUpload, aspectRatio = 'square',
}: {
  label: string; hint: string; imageUrl?: string; uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  aspectRatio?: 'square' | 'wide';
}) {
  const inputId = `upload-${label.toLowerCase().replace(/\s/g, '-')}`;
  return (
    <div>
      <Label>{label}</Label>
      <input type="file" id={inputId} accept="image/*" onChange={onUpload} className="hidden" />
      <label htmlFor={inputId}
        className="block border-2 border-dashed border-slate-200 rounded-xl overflow-hidden
          cursor-pointer hover:border-[#1F3469]/40 hover:bg-slate-50/50 transition-all group">
        {uploading ? (
          <div className={`flex flex-col items-center justify-center gap-2 ${aspectRatio === 'wide' ? 'h-24' : 'h-28'}`}>
            <div className="w-6 h-6 border-2 border-[#1F3469] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Uploading…</p>
          </div>
        ) : imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt={label}
              className={`w-full object-cover ${aspectRatio === 'wide' ? 'h-24' : 'h-28 object-contain p-2'}`} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <Upload size={12} /> Change
              </span>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center gap-2 text-center ${aspectRatio === 'wide' ? 'h-24' : 'h-28'}`}>
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#1F3469]/10 flex items-center justify-center transition-colors">
              <Upload size={16} className="text-slate-400 group-hover:text-[#1F3469] transition-colors" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Click to upload</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WebsiteManagerContent() {
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [original, setOriginal] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [hours, setHours] = useState<WeekSchedule>(DEFAULT_HOURS);

  const isDirty = JSON.stringify(profileData) !== JSON.stringify(original);

  useEffect(() => { fetchDealership(); }, []);

  const fetchDealership = async () => {
    try {
      const res = await fetch('/api/dealer/dealership');
      const data = await res.json();
      if (data.success && data.dealership) {
        setProfileData(data.dealership);
        setOriginal(data.dealership);
        setHours(parseHours(data.dealership.openingHours));
      }
    } catch {
      showToast({ title: 'Failed to load dealership data', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dealership/${profileData?.slug || ''}`
    : `/dealership/${profileData?.slug || ''}`;

  const up = useCallback((field: keyof ProfileData) => (val: string | boolean) =>
    setProfileData(prev => prev ? { ...prev, [field]: val } : prev), []);

  const handleNameChange = (name: string) => {
    if (!profileData) return;
    const newData: ProfileData = { ...profileData, name };
    if (!profileData.slug || profileData.slug === generateSlug(profileData.name || '')) {
      newData.slug = generateSlug(name);
    }
    setProfileData(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...profileData, openingHours: JSON.stringify(hours) };
      const res = await fetch('/api/dealer/dealership', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.dealership);
        setOriginal(data.dealership);
        showToast({ title: 'Profile updated successfully!', variant: 'success' });
      } else {
        showToast({ title: data.error || 'Failed to update profile', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Failed to save changes', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover',
    setUploading: (v: boolean) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast({ title: 'File must be under 5MB', variant: 'error' }); return; }
    if (!file.type.startsWith('image/')) { showToast({ title: 'Please upload an image file', variant: 'error' }); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const res = await fetch('/api/dealer/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setProfileData(prev => prev ? { ...prev, [type === 'logo' ? 'logo' : 'coverImage']: data.url } : prev);
        showToast({ title: `${type === 'logo' ? 'Logo' : 'Cover image'} uploaded!`, variant: 'success' });
      } else {
        showToast({ title: data.error || 'Upload failed', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Upload failed', variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const updateDay = (day: string, field: keyof DaySchedule, val: string | boolean) => {
    const updated = { ...hours, [day]: { ...hours[day], [field]: val } };
    setHours(updated);
    setProfileData(prev => prev ? { ...prev, openingHours: JSON.stringify(updated) } : prev);
  };

  const tabComplete = useMemo(() => ({
    profile:  !!(profileData?.name && profileData?.description),
    contact:  !!(profileData?.phone && profileData?.email),
    location: !!(profileData?.city && profileData?.region),
    hours:    !!(profileData?.openingHours),
    social:   !!(profileData?.facebookUrl || profileData?.instagramUrl),
  }), [profileData]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle size={28} className="text-red-400" />
        <p className="font-semibold text-slate-700">No dealership found</p>
        <p className="text-sm text-slate-400">Please contact support</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header + actions ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Website Manager</h2>
            {profileData.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-semibold text-green-700">
                <Shield size={9} /> Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Manage your public dealership profile on Cars.na</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {profileData.slug && (
            <a href={`/dealership/${profileData.slug}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
              <ExternalLink size={12} /> Preview
            </a>
          )}
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white
              transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: NAVY }}>
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save size={13} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Unsaved changes strip ─────────────────────────────────────── */}
      {isDirty && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Unsaved changes
          </div>
          <button onClick={() => { setProfileData(original); setHours(parseHours(original?.openingHours)); }}
            className="text-xs text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer font-medium">
            <RotateCcw size={10} /> Discard
          </button>
        </div>
      )}

      {/* ── Profile link bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Globe size={15} className="text-slate-400 flex-shrink-0" />
        <span className="text-sm text-slate-500 font-mono flex-1 truncate min-w-0">{profileUrl}</span>
        <button onClick={() => { navigator.clipboard.writeText(profileUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-slate-200
            text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex-shrink-0">
          {copied ? <><Check size={11} className="text-green-500" /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
        <button onClick={() => window.open(profileUrl, '_blank')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-slate-200
            text-slate-600 hover:bg-slate-50 transition-all cursor-pointer flex-shrink-0">
          <ExternalLink size={11} /> View
        </button>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main content (2/3) ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tabs */}
          <div className="flex items-center gap-0.5 bg-slate-100/80 rounded-lg p-1 overflow-x-auto no-scrollbar">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const complete = tabComplete[tab.id];
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                    ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                  <Icon size={12} />
                  <span>{tab.label}</span>
                  {complete && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab panels */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 size={14} style={{ color: NAVY }} />
                  <span className="text-sm font-bold text-slate-800">Business Information</span>
                </div>
                <div>
                  <Label required>Dealership Name</Label>
                  <Field icon={Building2} value={profileData.name || ''} onChange={handleNameChange} placeholder="e.g. Windhoek Auto Centre" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Type</Label>
                    <FieldSelect value={profileData.businessType || ''} onChange={v => up('businessType')(v)}
                      options={BUSINESS_TYPES} placeholder="Select type…" />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Field icon={User} value={profileData.contactPerson || ''} onChange={v => up('contactPerson')(v)} placeholder="e.g. John Smith" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label>About Your Dealership</Label>
                    <span className="text-[10px] text-slate-400 font-mono">{(profileData.description || '').length}/500</span>
                  </div>
                  <textarea value={profileData.description || ''}
                    onChange={e => up('description')(e.target.value)} maxLength={500} rows={3}
                    placeholder="Tell customers what makes your dealership special…"
                    className="w-full border border-slate-200 rounded-lg bg-white text-slate-800 text-sm py-2 px-3
                      focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
                      placeholder:text-slate-300 resize-none transition-all" />
                </div>
                <div>
                  <Label>Specializations</Label>
                  <Field icon={FileText} value={profileData.specializations || ''} onChange={v => up('specializations')(v)}
                    placeholder="e.g. Luxury Cars, SUVs, 4x4 Vehicles" />
                  <p className="text-[10px] text-slate-400 mt-1">Separate with commas</p>
                </div>
                <div>
                  <Label required>Profile URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">/dealership/</span>
                    <Field icon={Hash} value={profileData.slug || ''} onChange={v => up('slug')(generateSlug(v))} placeholder="your-dealership" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Link size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-mono truncate">cars.na/dealership/{profileData.slug || 'your-slug'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Phone size={14} style={{ color: NAVY }} />
                  <span className="text-sm font-bold text-slate-800">Contact Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Primary Phone</Label>
                    <Field icon={Phone} value={profileData.phone || ''} onChange={v => up('phone')(v)} placeholder="+264 81 123 4567" type="tel" />
                  </div>
                  <div>
                    <Label>Alternate Phone</Label>
                    <Field icon={Phone} value={profileData.alternatePhone || ''} onChange={v => up('alternatePhone')(v)} placeholder="+264 81 123 4567" type="tel" />
                  </div>
                </div>
                <div>
                  <Label required>Email Address</Label>
                  <Field icon={Mail} value={profileData.email || ''} onChange={v => up('email')(v)} placeholder="info@dealership.na" type="email" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>WhatsApp Number</Label>
                    <Field icon={Phone} value={profileData.whatsappNumber || ''} onChange={v => up('whatsappNumber')(v)} placeholder="+264 81 123 4567" type="tel" />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Field icon={Globe} value={profileData.website || ''} onChange={v => up('website')(v)} placeholder="www.dealership.na" type="url" />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {activeTab === 'location' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin size={14} style={{ color: NAVY }} />
                  <span className="text-sm font-bold text-slate-800">Location & Address</span>
                </div>
                <div>
                  <Label>Street Address</Label>
                  <Field icon={MapPin} value={profileData.streetAddress || ''} onChange={v => up('streetAddress')(v)} placeholder="123 Independence Avenue" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>City / Town</Label>
                    <Field value={profileData.city || ''} onChange={v => up('city')(v)} placeholder="Windhoek" />
                  </div>
                  <div>
                    <Label>Region</Label>
                    <FieldSelect value={profileData.region || ''} onChange={v => up('region')(v)}
                      options={REGIONS} placeholder="Select region…" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Postal Code</Label>
                    <Field value={profileData.postalCode || ''} onChange={v => up('postalCode')(v)} placeholder="10001" />
                  </div>
                  <div>
                    <Label>Google Maps Link</Label>
                    <Field icon={MapPin} value={profileData.googleMapsUrl || ''} onChange={v => up('googleMapsUrl')(v)} placeholder="https://maps.google.com/..." type="url" />
                  </div>
                </div>
              </div>
            )}

            {/* Hours */}
            {activeTab === 'hours' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Clock size={14} style={{ color: NAVY }} />
                  <span className="text-sm font-bold text-slate-800">Business Hours</span>
                </div>
                <div className="space-y-2">
                  {DAYS.map(day => (
                    <div key={day} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors
                      ${hours[day]?.closed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100 bg-white'}`}>
                      <span className={`text-xs font-medium w-20 flex-shrink-0 ${hours[day]?.closed ? 'text-slate-400' : 'text-slate-700'}`}>{day}</span>
                      <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                        <input type="checkbox" checked={!hours[day]?.closed}
                          onChange={e => updateDay(day, 'closed', !e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-300 accent-[#1F3469] cursor-pointer" />
                        <span className="text-[11px] text-slate-500">{hours[day]?.closed ? 'Closed' : 'Open'}</span>
                      </label>
                      {!hours[day]?.closed && (
                        <div className="flex items-center gap-1.5 ml-auto">
                          <input type="time" value={hours[day]?.open || '08:00'}
                            onChange={e => updateDay(day, 'open', e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1F3469]/30" />
                          <span className="text-[10px] text-slate-400">–</span>
                          <input type="time" value={hours[day]?.close || '17:00'}
                            onChange={e => updateDay(day, 'close', e.target.value)}
                            className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1F3469]/30" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Special offer */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-sm font-bold text-slate-800">Special Offer</span>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" checked={profileData.highlightActive || false}
                        onChange={e => up('highlightActive')(e.target.checked as unknown as string)}
                        className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-checked:bg-[#1F3469] rounded-full transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-sm text-slate-700">Show on profile</span>
                  </label>
                  {profileData.highlightActive && (
                    <div className="space-y-3">
                      <div>
                        <Label>Offer Title</Label>
                        <Field icon={Zap} value={profileData.highlightTitle || ''} onChange={v => up('highlightTitle')(v)} placeholder="e.g. Summer Sale — 10% Off All SUVs" />
                      </div>
                      <div>
                        <Label>Offer Description</Label>
                        <textarea value={profileData.highlightDescription || ''}
                          onChange={e => up('highlightDescription')(e.target.value)} rows={2} maxLength={200}
                          placeholder="Brief description of your offer…"
                          className="w-full border border-slate-200 rounded-lg text-sm py-2 px-3
                            focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469]/40
                            placeholder:text-slate-300 resize-none transition-all" />
                      </div>
                      {profileData.highlightTitle && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap size={12} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-800">{profileData.highlightTitle}</span>
                          </div>
                          {profileData.highlightDescription && (
                            <p className="text-xs text-amber-700 pl-5">{profileData.highlightDescription}</p>
                          )}
                          <p className="text-[10px] text-amber-400 mt-1.5 pl-5">Preview</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social */}
            {activeTab === 'social' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Share2 size={14} style={{ color: NAVY }} />
                  <span className="text-sm font-bold text-slate-800">Social Media</span>
                </div>
                <p className="text-xs text-slate-500">Customers will see links to these on your public profile.</p>
                <div className="space-y-2">
                  <SocialRow icon={Facebook} iconColor="#1877F2" label="Facebook"
                    value={profileData.facebookUrl || ''} onChange={v => up('facebookUrl')(v)}
                    placeholder="https://facebook.com/yourdealership" />
                  <SocialRow icon={Instagram} iconColor="#E1306C" label="Instagram"
                    value={profileData.instagramUrl || ''} onChange={v => up('instagramUrl')(v)}
                    placeholder="https://instagram.com/yourdealership" />
                  <SocialRow icon={Twitter} iconColor="#1DA1F2" label="X / Twitter"
                    value={profileData.twitterUrl || ''} onChange={v => up('twitterUrl')(v)}
                    placeholder="https://x.com/yourdealership" />
                  <SocialRow icon={Linkedin} iconColor="#0A66C2" label="LinkedIn"
                    value={profileData.linkedinUrl || ''} onChange={v => up('linkedinUrl')(v)}
                    placeholder="https://linkedin.com/company/yourdealership" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar (1/3) ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Completeness + stats */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <CompletenessRing data={profileData} />
            <div className="border-t border-slate-100 pt-3 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Eye size={13} /> <span className="text-xs">Profile Views</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{profileData.profileViews ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <TrendingUp size={13} /> <span className="text-xs">Active Listings</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{profileData._count?.vehicles ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <User size={13} /> <span className="text-xs">Team Members</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{profileData._count?.users ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield size={13} /> <span className="text-xs">Status</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  profileData.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>{profileData.status || 'PENDING'}</span>
              </div>
            </div>
          </div>

          {/* Image uploads */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon size={13} style={{ color: NAVY }} />
              <span className="text-xs font-bold text-slate-800">Profile Images</span>
            </div>
            <ImageUploadBox
              label="Logo" hint="200×200px · Max 5MB"
              imageUrl={profileData.logo} uploading={uploadingLogo}
              onUpload={e => handleImageUpload(e, 'logo', setUploadingLogo)}
              aspectRatio="square"
            />
            <ImageUploadBox
              label="Cover Image" hint="1200×400px · Max 5MB"
              imageUrl={profileData.coverImage} uploading={uploadingCover}
              onUpload={e => handleImageUpload(e, 'cover', setUploadingCover)}
              aspectRatio="wide"
            />
          </div>

          {/* Save action */}
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white
              transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            style={{ backgroundColor: NAVY }}>
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>

          {!isDirty && (
            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle size={11} className="text-green-400" /> All changes saved
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
