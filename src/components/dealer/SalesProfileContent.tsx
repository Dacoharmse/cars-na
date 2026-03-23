'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/Toast';
import {
  Save, User, Phone, MessageCircle, Globe, Award, Clock,
  Camera, Eye, EyeOff, Briefcase, Check, RotateCcw, AlertCircle,
  Hash, Shield,
} from 'lucide-react';

// ─── Brand ───────────────────────────────────────────────────────────────────
const NAVY = '#1F3469';
const GREEN = '#109B4A';
const RED = '#CB2030';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProfileData {
  name: string;
  jobTitle: string;
  phone: string;
  whatsappNumber: string;
  bio: string;
  yearsExperience: string;
  languages: string;
  specialties: string;
  profileImage: string;
  isPublicProfile: boolean;
  displayOrder: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: '', jobTitle: '', phone: '', whatsappNumber: '',
  bio: '', yearsExperience: '', languages: '', specialties: '',
  profileImage: '', isPublicProfile: true, displayOrder: '',
};

type TabId = 'basic' | 'professional' | 'settings';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'basic', label: 'Basic Info', icon: User },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Shield },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function StyledInput({
  value, onChange, placeholder, type = 'text', rows,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; rows?: number;
}) {
  const base = 'w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all';
  if (rows) {
    return (
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        className={`${base} py-2.5 resize-none`}
        style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
      />
    );
  }
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} py-2.5`}
      style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
    />
  );
}

function AvatarUpload({
  name, imageUrl, onUpload, uploading,
}: {
  name: string; imageUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}) {
  const initials = name.trim()
    ? name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0 group">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt={name || 'Profile'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY}cc)` }}>
              {initials}
            </div>
          )}
        </div>
        <label
          htmlFor="profile-photo-upload"
          className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploading ? 'opacity-100' : ''}`}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera size={18} className="text-white" />
          )}
          <input id="profile-photo-upload" type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{name || 'Your Name'}</p>
        <p className="text-xs text-slate-400 mt-0.5">Click avatar to change photo</p>
        <p className="text-[11px] text-slate-300 mt-0.5">Min. 200×200px · JPG, PNG, WebP</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SalesProfileContent() {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [original, setOriginal] = useState<ProfileData>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty = JSON.stringify(profile) !== JSON.stringify(original);

  // ── Fetch ──
  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dealer/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        const p: ProfileData = {
          name: data.profile.name || '',
          jobTitle: data.profile.jobTitle || '',
          phone: data.profile.phone || '',
          whatsappNumber: data.profile.whatsappNumber || '',
          bio: data.profile.bio || '',
          yearsExperience: data.profile.yearsExperience?.toString() || '',
          languages: data.profile.languages || '',
          specialties: data.profile.specialties || '',
          profileImage: data.profile.profileImage || '',
          isPublicProfile: data.profile.isPublicProfile ?? true,
          displayOrder: data.profile.displayOrder?.toString() || '',
        };
        setProfile(p);
        setOriginal(p);
      }
    } catch {
      showToast({ title: 'Failed to load profile', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ── Save ──
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/dealer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setOriginal(profile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        showToast({ title: 'Profile updated!', variant: 'success' });
      } else {
        showToast({ title: data.error || 'Failed to update', variant: 'error' });
      }
    } catch {
      showToast({ title: 'Failed to save changes', variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // ── Photo upload (base64, saved with profile PUT) ──
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast({ title: 'File must be under 5MB', variant: 'error' }); return; }
    if (!file.type.startsWith('image/')) { showToast({ title: 'Please upload an image file', variant: 'error' }); return; }
    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(p => ({ ...p, profileImage: reader.result as string }));
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const up = (field: keyof ProfileData) => (val: string | boolean) =>
    setProfile(prev => ({ ...prev, [field]: val }));

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  const completionFields = [
    { key: 'name', w: 15 }, { key: 'jobTitle', w: 10 }, { key: 'phone', w: 10 },
    { key: 'bio', w: 20 }, { key: 'profileImage', w: 15 }, { key: 'yearsExperience', w: 10 },
    { key: 'languages', w: 10 }, { key: 'specialties', w: 10 },
  ];
  const totalW = completionFields.reduce((s, f) => s + f.w, 0);
  const filledW = completionFields.reduce((s, f) => {
    const v = profile[f.key as keyof ProfileData];
    return s + (v !== undefined && v !== null && v !== '' && v !== false ? f.w : 0);
  }, 0);
  const pct = Math.round((filledW / totalW) * 100);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = pct >= 80 ? GREEN : pct >= 50 ? '#F59E0B' : RED;

  return (
    <div className="space-y-0">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${NAVY}15` }}>
            <User size={18} style={{ color: NAVY }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">My Sales Profile</h2>
            <p className="text-xs text-slate-500">Visible to customers on vehicle listings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={() => setProfile(original)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw size={12} /> Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: saving ? '#94a3b8' : saved ? GREEN : NAVY }}
          >
            {saving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
            ) : saved ? (
              <><Check size={14} /> Saved!</>
            ) : (
              <><Save size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* ── Unsaved banner ── */}
      {isDirty && (
        <div className="flex items-center gap-2 px-4 py-2.5 mb-5 rounded-lg border text-sm"
          style={{ background: `${NAVY}08`, borderColor: `${NAVY}30`, color: NAVY }}>
          <AlertCircle size={14} className="flex-shrink-0" />
          <span className="font-medium">You have unsaved changes.</span>
          <span className="text-slate-500">Don't forget to save before leaving.</span>
        </div>
      )}

      {/* ── Main 2-col layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Left: tabs + form ── */}
        <div className="xl:col-span-2 space-y-4">

          {/* Photo row */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <AvatarUpload
              name={profile.name}
              imageUrl={profile.profileImage}
              onUpload={handlePhotoUpload}
              uploading={uploadingPhoto}
            />
          </div>

          {/* Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/60">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-all border-b-2 ${
                      active
                        ? 'border-b-2 text-white'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    style={active ? { borderBottomColor: NAVY, backgroundColor: NAVY, color: '#fff' } : {}}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5 space-y-4">

              {/* ── Basic Info ── */}
              {activeTab === 'basic' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>Full Name</FieldLabel>
                      <StyledInput value={profile.name} onChange={up('name')} placeholder="Daco Harmse" />
                    </div>
                    <div>
                      <FieldLabel>Job Title</FieldLabel>
                      <StyledInput value={profile.jobTitle} onChange={up('jobTitle')} placeholder="Senior Sales Executive" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Phone Number</FieldLabel>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="tel" value={profile.phone} onChange={e => up('phone')(e.target.value)}
                          placeholder="+264 81 123 4567"
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                          style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>WhatsApp Number</FieldLabel>
                      <div className="relative">
                        <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ color: GREEN }} />
                        <input type="tel" value={profile.whatsappNumber} onChange={e => up('whatsappNumber')(e.target.value)}
                          placeholder="+264 81 123 4567"
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                          style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Bio</FieldLabel>
                    <StyledInput
                      value={profile.bio}
                      onChange={up('bio')}
                      placeholder="Tell customers about your experience and what makes you the right person to help them find their perfect vehicle..."
                      rows={4}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Shown to customers browsing your vehicle listings · {profile.bio.length}/500</p>
                  </div>
                </>
              )}

              {/* ── Professional ── */}
              {activeTab === 'professional' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Years of Experience</FieldLabel>
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" min="0" max="50" value={profile.yearsExperience}
                          onChange={e => up('yearsExperience')(e.target.value)}
                          placeholder="5"
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                          style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Languages Spoken</FieldLabel>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={profile.languages}
                          onChange={e => up('languages')(e.target.value)}
                          placeholder="English, Afrikaans, German"
                          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                          style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Separate with commas</p>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Specialties</FieldLabel>
                    <div className="relative">
                      <Award size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" value={profile.specialties}
                        onChange={e => up('specialties')(e.target.value)}
                        placeholder="Luxury Cars, SUVs, Commercial Vehicles, Financing"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                        style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Separate with commas · shown as badges on your profile</p>
                  </div>

                  {/* Specialty preview */}
                  {profile.specialties && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.specialties.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-full border"
                          style={{ backgroundColor: `${NAVY}10`, color: NAVY, borderColor: `${NAVY}25` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Settings ── */}
              {activeTab === 'settings' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${GREEN}15` }}>
                        <Eye size={16} style={{ color: GREEN }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Show in Sales Team</p>
                        <p className="text-xs text-slate-500">Your profile appears on the dealership page</p>
                      </div>
                    </div>
                    <button
                      onClick={() => up('isPublicProfile')(!profile.isPublicProfile)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none`}
                      style={{ backgroundColor: profile.isPublicProfile ? GREEN : '#cbd5e1' }}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        profile.isPublicProfile ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <FieldLabel>Display Order</FieldLabel>
                    <div className="relative">
                      <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" min="0" value={profile.displayOrder}
                        onChange={e => up('displayOrder')(e.target.value)}
                        placeholder="1"
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-slate-300 transition-all"
                        style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Lower numbers appear first in the sales team list</p>
                  </div>

                  <div className="p-4 rounded-xl border" style={{ background: `${NAVY}05`, borderColor: `${NAVY}15` }}>
                    <div className="flex items-start gap-3">
                      <Shield size={15} style={{ color: NAVY }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">Profile visibility</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          When visible, customers can see your name, photo, job title, bio, languages, and contact details on vehicle listings associated with your dealership.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <div className="space-y-4">

          {/* Completeness ring */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r="28" fill="none"
                    stroke={ringColor} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={offset}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">{pct}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Profile Complete</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {pct >= 80 ? 'Great profile! Customers can find you easily.' : pct >= 50 ? 'Add more details to build trust.' : 'Complete your profile to attract leads.'}
                </p>
              </div>
            </div>

            {/* Missing field hints */}
            {pct < 100 && (
              <div className="mt-4 space-y-1.5">
                {completionFields
                  .filter(f => !profile[f.key as keyof ProfileData] || profile[f.key as keyof ProfileData] === '')
                  .slice(0, 3)
                  .map(f => (
                    <div key={f.key} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span>Add {f.key === 'profileImage' ? 'a profile photo' : f.key === 'yearsExperience' ? 'years of experience' : f.key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          {/* Preview card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Preview</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY}cc)` }}>
                    {profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'ME'}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{profile.name || 'Your Name'}</p>
                <p className="text-xs text-slate-500 truncate">{profile.jobTitle || 'Job Title'}</p>
                {profile.yearsExperience && (
                  <p className="text-[11px] mt-0.5" style={{ color: NAVY }}>
                    {profile.yearsExperience} yr{parseInt(profile.yearsExperience) !== 1 ? 's' : ''} experience
                  </p>
                )}
              </div>
            </div>
            {profile.bio && (
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-3">{profile.bio}</p>
            )}
            {profile.specialties && (
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.specialties.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                    style={{ backgroundColor: `${NAVY}10`, color: NAVY }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                profile.isPublicProfile ? 'text-green-700 bg-green-50' : 'text-slate-500 bg-slate-100'
              }`}>
                {profile.isPublicProfile ? <><Eye size={9} /> Visible</> : <><EyeOff size={9} /> Hidden</>}
              </span>
              {profile.languages && (
                <span className="text-[10px] text-slate-400">{profile.languages.split(',')[0].trim()}</span>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tips</p>
            <div className="space-y-2.5">
              {[
                { tip: 'Use a clear, professional headshot for your photo', icon: Camera },
                { tip: 'A detailed bio builds customer trust', icon: User },
                { tip: 'List specialties to attract the right buyers', icon: Award },
              ].map(({ tip, icon: Icon }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Icon size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save button (sidebar) */}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: saving ? '#94a3b8' : NAVY }}
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
            ) : (
              <><Save size={15} />Save Profile</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
