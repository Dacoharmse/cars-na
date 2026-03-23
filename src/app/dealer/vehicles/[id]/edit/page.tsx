'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { X, Upload, Car, Wrench, CheckSquare, FileText, ImageIcon, Tag, ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Gauge, Users, Anchor, Weight } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import {
  VEHICLE_CATEGORIES,
  VehicleCategoryKey,
  getManufacturers,
  CAR_BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  COMFORT_FEATURES,
  SAFETY_FEATURES,
} from '@/lib/vehicleCategories';

/* ─── Types ─────────────────────────────────────────── */
interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface VehicleFormData {
  category: VehicleCategoryKey;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  color: string;
  internalRef: string;
  isNew: boolean;
  financing: boolean;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  // Technical
  transmission: string;
  fuelType: string;
  bodyType: string;
  engineCapacity: string;
  horsepower: string;
  loadCapacity: string;
  passengerCapacity: string;
  length: string;
  weight: string;
  // Features
  comfort: string[];
  safety: string[];
  // Description
  description: string;
}

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Available', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  SOLD:      { label: 'Sold',      color: 'bg-red-50 text-red-700 border-red-200',           dot: 'bg-red-500' },
  RESERVED:  { label: 'Reserved',  color: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500' },
};

/* ─── Section Header ────────────────────────────────── */
function SectionHeader({ icon: Icon, title, description }: { icon: any; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-4 border-b border-slate-100">
      <div className="w-9 h-9 rounded-lg bg-[#1F3469]/8 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(31,52,105,0.08)' }}>
        <Icon className="w-4.5 h-4.5 text-[#1F3469]" style={{ width: '18px', height: '18px' }} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 leading-tight">{title}</h2>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

/* ─── Form Field ────────────────────────────────────── */
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-[#CB2030] ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/* ─── Input styles ──────────────────────────────────── */
const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F3469]/20 focus:border-[#1F3469] transition-colors";
const selectCls = inputCls;

/* ─── Main Component ────────────────────────────────── */
export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading]   = useState(true);
  const [isSaving, setIsSaving]     = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [newImages, setNewImages]           = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [form, setForm] = useState<VehicleFormData>({
    category: 'CARS',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    color: '',
    internalRef: '',
    isNew: false,
    financing: true,
    status: 'AVAILABLE',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    bodyType: '',
    engineCapacity: '',
    horsepower: '',
    loadCapacity: '',
    passengerCapacity: '',
    length: '',
    weight: '',
    comfort: [],
    safety: [],
    description: '',
  });

  /* ── Fetch vehicle ── */
  useEffect(() => {
    const load = async () => {
      if (status === 'loading') return;
      if (!session?.user) { router.push('/dealer/login'); return; }

      try {
        const resolved = await params;
        const res = await fetch(`/api/dealer/vehicles/${resolved.id}`);
        if (!res.ok) throw new Error('Not found');
        const { vehicle: v } = await res.json();

        setForm({
          category:          v.category || 'CARS',
          make:              v.manufacturer || '',
          model:             v.model || '',
          year:              v.year?.toString() || '',
          price:             v.price?.toString() || '',
          mileage:           v.mileage?.toString() || '',
          color:             v.color || '',
          internalRef:       v.internalRef || '',
          isNew:             v.isNew || false,
          financing:         v.financing !== undefined ? v.financing : true,
          status:            v.status || 'AVAILABLE',
          transmission:      v.transmission || 'Automatic',
          fuelType:          v.fuelType || 'Petrol',
          bodyType:          v.bodyType || '',
          engineCapacity:    v.engineCapacity?.toString() || '',
          horsepower:        v.horsepower?.toString() || '',
          loadCapacity:      v.loadCapacity?.toString() || '',
          passengerCapacity: v.passengerCapacity?.toString() || '',
          length:            v.length?.toString() || '',
          weight:            v.weight?.toString() || '',
          comfort:           v.comfort || [],
          safety:            v.safety || [],
          description:       v.description || '',
        });

        if (v.images?.length) setExistingImages(v.images);
      } catch {
        setError('Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params, session, status, router]);

  const set = (field: keyof VehicleFormData, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const toggleFeature = (cat: 'comfort' | 'safety', feature: string) =>
    setForm(prev => ({
      ...prev,
      [cat]: prev[cat].includes(feature)
        ? prev[cat].filter(f => f !== feature)
        : [...prev[cat], feature],
    }));

  /* ── Image upload ── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      const opts = { maxSizeMB: 0.1, maxWidthOrHeight: 600, useWebWorker: true, initialQuality: 0.6 };
      const converted = await Promise.all(
        Array.from(e.target.files).map(async file => {
          const compressed = await imageCompression(file, opts);
          return new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = ev => res(ev.target?.result as string);
            r.onerror = rej;
            r.readAsDataURL(compressed);
          });
        })
      );
      const slots = 12 - existingImages.length + imagesToDelete.length;
      setNewImages(prev => [...prev, ...converted].slice(0, slots));
    } catch {
      setError('Failed to process images. Please try again.');
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const resolved = await params;
      const res = await fetch(`/api/dealer/vehicles/${resolved.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:          form.category,
          manufacturer:      form.make,
          model:             form.model,
          year:              parseInt(form.year),
          price:             parseFloat(form.price),
          mileage:           parseInt(form.mileage),
          color:             form.color,
          internalRef:       form.internalRef,
          isNew:             form.isNew,
          financing:         form.financing,
          status:            form.status,
          transmission:      form.transmission,
          fuelType:          form.fuelType,
          bodyType:          form.bodyType,
          engineCapacity:    form.engineCapacity || null,
          horsepower:        form.horsepower ? parseInt(form.horsepower) : null,
          loadCapacity:      form.loadCapacity ? parseFloat(form.loadCapacity) : null,
          passengerCapacity: form.passengerCapacity ? parseInt(form.passengerCapacity) : null,
          length:            form.length ? parseFloat(form.length) : null,
          weight:            form.weight ? parseFloat(form.weight) : null,
          comfort:           form.comfort,
          safety:            form.safety,
          description:       form.description,
          imagesToDelete,
          newImages,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/dealer/dashboard'), 1500);
      } else {
        setError(result.message || 'Failed to update vehicle');
      }
    } catch {
      setError('An error occurred while updating the vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Category-specific fields ── */
  const catFields = (VEHICLE_CATEGORIES[form.category]?.fields || []) as unknown as string[];
  const showLoad      = catFields.includes('loadCapacity');
  const showPassenger = catFields.includes('passengerCapacity');
  const showLength    = catFields.includes('length');
  const showWeight    = catFields.includes('weight');
  const showBodyType  = form.category === 'CARS';
  const showMileage   = catFields.includes('mileage');

  const manufacturers = getManufacturers(form.category);
  const totalImages   = existingImages.length + newImages.length;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1F3469] mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading vehicle data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-36">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/dealer/dashboard')}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Edit Vehicle</h1>
            <p className="text-xs text-slate-500 truncate">
              {form.make} {form.model} {form.year && `· ${form.year}`}
            </p>
          </div>
          {/* Status pill */}
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_CONFIG[form.status].color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[form.status].dot}`} />
            {STATUS_CONFIG[form.status].label}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-5">
        {/* ── Alerts ── */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Vehicle updated successfully! Redirecting…</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="edit-form" className="space-y-5">

          {/* ══ 1. Listing Info ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Tag} title="Listing Info" description="Category, condition, financing and listing status" />

            {/* Row 1: Category + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Vehicle Category" required>
                <select
                  className={selectCls}
                  value={form.category}
                  onChange={e => set('category', e.target.value as VehicleCategoryKey)}
                >
                  {Object.entries(VEHICLE_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Listing Status" required>
                <div className="flex gap-1.5 pt-0.5">
                  {(Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('status', s)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                        form.status === s
                          ? STATUS_CONFIG[s].color + ' shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Row 2: Condition + Financing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Brand New vs Used */}
              <Field label="Vehicle Condition">
                <div className="flex gap-2 pt-0.5">
                  {[
                    { val: false, label: 'Used', desc: 'Pre-owned vehicle' },
                    { val: true,  label: 'Brand New', desc: 'New, unregistered' },
                  ].map(({ val, label, desc }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => set('isNew', val)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-all text-left ${
                        form.isNew === val
                          ? 'bg-[#1F3469] text-white border-[#1F3469] shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-semibold">{label}</span>
                      <span className={`block text-xs mt-0.5 ${form.isNew === val ? 'text-white/70' : 'text-slate-400'}`}>{desc}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Financing available */}
              <Field label="Financing Available" hint="Whether buyers can apply for finance on this vehicle">
                <div className="flex gap-2 pt-0.5">
                  {[
                    { val: true,  label: 'Yes', desc: 'Finance offered' },
                    { val: false, label: 'No',  desc: 'Cash only' },
                  ].map(({ val, label, desc }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => set('financing', val)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-all text-left ${
                        form.financing === val
                          ? val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-600 text-white border-slate-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-semibold">{label}</span>
                      <span className={`block text-xs mt-0.5 ${form.financing === val ? 'text-white/70' : 'text-slate-400'}`}>{desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          {/* ══ 2. Basic Information ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Car} title="Basic Information" description="Make, model, year and pricing details" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Make */}
              <Field label="Make / Manufacturer" required>
                <input
                  list="manufacturers-list"
                  className={inputCls}
                  value={form.make}
                  onChange={e => set('make', e.target.value)}
                  placeholder={`e.g. ${manufacturers[0] || 'Toyota'}`}
                  required
                />
                <datalist id="manufacturers-list">
                  {manufacturers.map(m => <option key={m} value={m} />)}
                </datalist>
              </Field>

              {/* Model */}
              <Field label="Model" required>
                <input
                  className={inputCls}
                  value={form.model}
                  onChange={e => set('model', e.target.value)}
                  placeholder="e.g. Hilux, X5, C-Class"
                  required
                />
              </Field>

              {/* Year */}
              <Field label="Year" required>
                <input
                  type="number"
                  className={inputCls}
                  value={form.year}
                  onChange={e => set('year', e.target.value)}
                  min={1900}
                  max={new Date().getFullYear() + 2}
                  placeholder={String(new Date().getFullYear())}
                  required
                />
              </Field>

              {/* Price */}
              <Field label="Price (N$)" required>
                <input
                  type="number"
                  className={inputCls}
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  min={0}
                  placeholder="e.g. 250000"
                  required
                />
              </Field>

              {/* Mileage — shown for most categories */}
              {(showMileage || form.category === 'MOTORCYCLES') && (
                <Field label="Mileage (km)" required>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.mileage}
                    onChange={e => set('mileage', e.target.value)}
                    min={0}
                    placeholder="e.g. 45000"
                    required
                  />
                </Field>
              )}

              {/* Color */}
              <Field label="Colour">
                <input
                  className={inputCls}
                  value={form.color}
                  onChange={e => set('color', e.target.value)}
                  placeholder="e.g. Pearl White, Midnight Blue"
                />
              </Field>

              {/* Internal Reference */}
              <Field label="Internal Reference / Stock #">
                <input
                  className={inputCls}
                  value={form.internalRef}
                  onChange={e => set('internalRef', e.target.value)}
                  placeholder="e.g. STK-00123"
                />
              </Field>
            </div>
          </div>

          {/* ══ 3. Technical Specifications ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Wrench} title="Technical Specifications" description="Engine, drivetrain and body details" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Transmission */}
              <Field label="Transmission">
                <select className={selectCls} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                  {TRANSMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              {/* Fuel Type */}
              <Field label="Fuel Type">
                <select className={selectCls} value={form.fuelType} onChange={e => set('fuelType', e.target.value)}>
                  {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </Field>

              {/* Body Type — cars only */}
              {showBodyType && (
                <Field label="Body Type">
                  <select className={selectCls} value={form.bodyType} onChange={e => set('bodyType', e.target.value)}>
                    <option value="">Select body type…</option>
                    {CAR_BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              )}

              {/* Engine Capacity */}
              {catFields.includes('engineCapacity') && (
                <Field label="Engine Capacity (L)" hint="e.g. 2.0 for a 2-litre engine">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.engineCapacity}
                    onChange={e => set('engineCapacity', e.target.value)}
                    placeholder="2.0"
                  />
                </Field>
              )}

              {/* Horsepower */}
              {catFields.includes('horsepower') && (
                <Field label="Horsepower (hp)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.horsepower}
                    onChange={e => set('horsepower', e.target.value)}
                    placeholder="150"
                  />
                </Field>
              )}

              {/* Load Capacity — trucks */}
              {showLoad && (
                <Field label="Load Capacity (tonnes)" hint="Maximum payload weight">
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      className={inputCls + ' pl-9'}
                      value={form.loadCapacity}
                      onChange={e => set('loadCapacity', e.target.value)}
                      placeholder="5.0"
                    />
                  </div>
                </Field>
              )}

              {/* Passenger Capacity — buses */}
              {showPassenger && (
                <Field label="Passenger Capacity" hint="Total number of seats">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      className={inputCls + ' pl-9'}
                      value={form.passengerCapacity}
                      onChange={e => set('passengerCapacity', e.target.value)}
                      placeholder="24"
                    />
                  </div>
                </Field>
              )}

              {/* Length — boats */}
              {showLength && (
                <Field label="Length (m)" hint="Overall vessel length in metres">
                  <div className="relative">
                    <Anchor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      className={inputCls + ' pl-9'}
                      value={form.length}
                      onChange={e => set('length', e.target.value)}
                      placeholder="6.5"
                    />
                  </div>
                </Field>
              )}

              {/* Weight — industrial / tractors */}
              {showWeight && (
                <Field label="Operating Weight (kg)" hint="Machine operating weight">
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      className={inputCls + ' pl-9'}
                      value={form.weight}
                      onChange={e => set('weight', e.target.value)}
                      placeholder="8500"
                    />
                  </div>
                </Field>
              )}
            </div>
          </div>

          {/* ══ 4. Features ══ */}
          {form.category !== 'ACCESSORIES' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <SectionHeader icon={CheckSquare} title="Features" description="Select all comfort and safety features fitted to this vehicle" />

              <div className="space-y-6">
                {/* Comfort */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Comfort &amp; Convenience</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMFORT_FEATURES.map(f => {
                      const on = form.comfort.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFeature('comfort', f)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                            on
                              ? 'bg-[#1F3469]/8 border-[#1F3469]/30 text-[#1F3469] font-medium'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          style={on ? { backgroundColor: 'rgba(31,52,105,0.07)', borderColor: 'rgba(31,52,105,0.25)' } : {}}
                        >
                          <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                            on ? 'bg-[#1F3469] border-[#1F3469]' : 'bg-white border-slate-300'
                          }`}>
                            {on && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </span>
                          <span className="leading-tight">{f}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Safety */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Safety &amp; Security</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SAFETY_FEATURES.map(f => {
                      const on = form.safety.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFeature('safety', f)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                            on
                              ? 'border-emerald-300 text-emerald-800 font-medium'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                          style={on ? { backgroundColor: 'rgba(16,185,129,0.07)', borderColor: 'rgba(16,185,129,0.35)' } : {}}
                        >
                          <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                            on ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'
                          }`}>
                            {on && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </span>
                          <span className="leading-tight">{f}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ 5. Description ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={FileText} title="Description" description="Write a compelling description for this listing" />
            <textarea
              className={inputCls + ' min-h-[140px] resize-y'}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the vehicle's history, condition, service records, notable features or any other details buyers should know…"
            />
            <p className="text-xs text-slate-400 mt-1.5">{form.description.length} characters</p>
          </div>

          {/* ══ 6. Images ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={ImageIcon} title="Vehicle Images" description={`${totalImages} / 12 images`} />

            {/* Existing */}
            {existingImages.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Current Images</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {existingImages.map(img => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                      <img src={img.url} alt="Vehicle" className="w-full h-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-[#1F3469] text-white px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImagesToDelete(p => [...p, img.id]);
                          setExistingImages(p => p.filter(i => i.id !== img.id));
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New */}
            {newImages.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">New Images</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {newImages.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 border-dashed">
                      <img src={img} alt="New" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewImages(p => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload */}
            {totalImages < 12 && (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-[#1F3469]/40 hover:bg-slate-50/50 transition-colors group w-fit">
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#1F3469]/8 flex items-center justify-center transition-colors" style={{}}>
                  <Upload className="w-4 h-4 text-slate-400 group-hover:text-[#1F3469] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Add images</p>
                  <p className="text-xs text-slate-400">{12 - totalImages} slot{12 - totalImages !== 1 ? 's' : ''} remaining · JPEG, PNG, WebP</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

        </form>
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-20">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 hidden sm:block">
            {form.make && form.model ? `${form.make} ${form.model}` : 'Vehicle'} · {STATUS_CONFIG[form.status].label}
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={() => router.push('/dealer/dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-form"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1F3469] text-white text-sm font-semibold hover:bg-[#162855] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
