'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import {
  User, Car, Camera, Eye, CheckCircle, ArrowLeft, ArrowRight,
  Upload, X, Truck, Bike, Anchor, Wrench, Tractor, Bus, Package,
  MapPin, Phone, Mail, AlertCircle,
} from 'lucide-react';

/* ─── Shared input styles ────────────────────────────────── */
const inputCls =
  'w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-[#CB2030] ' +
  'focus:ring-2 focus:ring-[#CB2030]/10 transition-colors';

const selectCls =
  'w-full h-11 px-3.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white ' +
  'focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/10 ' +
  'transition-colors appearance-none cursor-pointer ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")] ' +
  'bg-no-repeat bg-[right_12px_center] pr-10';

const textareaCls =
  'w-full px-3.5 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white ' +
  'placeholder:text-gray-400 focus:outline-none focus:border-[#CB2030] ' +
  'focus:ring-2 focus:ring-[#CB2030]/10 transition-colors resize-none';

const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 mb-1.5';

/* ─── Category definitions ───────────────────────────────── */
const CATEGORIES = {
  cars:        { name: 'Cars',                  icon: Car,     description: 'Sedans, hatchbacks, SUVs' },
  trucks:      { name: 'Trucks',                icon: Truck,   description: 'Bakkies, commercial trucks' },
  bikes:       { name: 'Motorcycles',           icon: Bike,    description: 'Motorcycles, scooters, ATVs' },
  buses:       { name: 'Buses',                 icon: Bus,     description: 'Buses, minibuses, coaches' },
  machinery:   { name: 'Machinery',             icon: Wrench,  description: 'Industrial & construction' },
  tractors:    { name: 'Farm Equipment',        icon: Tractor, description: 'Tractors, farm machinery' },
  boats:       { name: 'Boats & Marine',        icon: Anchor,  description: 'Boats, jet-skis, marine' },
  accessories: { name: 'Parts & Accessories',   icon: Package, description: 'Parts, accessories' },
};

const POPULAR_MANUFACTURERS = [
  'Toyota', 'BMW', 'Ford', 'Honda', 'Nissan', 'Mercedes-Benz', 'Audi', 'Volkswagen',
  'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Volvo', 'Jeep', 'Land Rover',
  'Porsche', 'Chevrolet', 'Peugeot', 'Renault', 'Mitsubishi', 'Suzuki', 'Isuzu',
  'Daihatsu', 'Opel', 'Fiat', 'Alfa Romeo', 'Jaguar', 'Infiniti', 'Acura',
];

const AVAILABLE_FEATURES = [
  'Air Conditioning', 'Power Steering', 'Electric Windows', 'Central Locking',
  'ABS Brakes', 'Airbags', 'Cruise Control', 'GPS Navigation',
  'Bluetooth', 'USB Ports', 'Backup Camera', 'Parking Sensors',
  'Leather Seats', 'Heated Seats', 'Sunroof', 'Alloy Wheels',
];

const STEPS = [
  { n: 1, label: 'Contact' },
  { n: 2, label: 'Details' },
  { n: 3, label: 'Features' },
  { n: 4, label: 'Photos' },
  { n: 5, label: 'Review' },
];

/* ─── Types ──────────────────────────────────────────────── */
interface FormData {
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerLocation: string;
  category: string;
  manufacturer: string;
  model: string;
  year: string;
  price: string;
  description: string;
  mileage?: string;
  engineCapacity?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  doors?: string;
  condition?: string;
  features: string[];
  images: File[];
  mainImageIndex: number;
}

/* ─── Image preview (upload step) ───────────────────────── */
function ImagePreview({
  image, index, onRemove, isMain, onSetMain,
}: {
  image: File; index: number; onRemove: () => void; isMain: boolean; onSetMain: () => void;
}) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    const r = new FileReader();
    r.onload = (e) => setSrc(e.target?.result as string);
    r.readAsDataURL(image);
    return () => setSrc('');
  }, [image]);

  return (
    <div className="relative group">
      <div className={`aspect-square rounded-lg overflow-hidden border-2 bg-gray-100 transition-all ${
        isMain ? 'border-[#CB2030] ring-2 ring-[#CB2030]/20' : 'border-gray-200'
      }`}>
        {src
          ? <img src={src} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Camera className="w-8 h-8 text-gray-300" /></div>
        }
        {isMain && (
          <span className="absolute top-2 left-2 bg-[#CB2030] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Cover
          </span>
        )}
      </div>
      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isMain && (
          <button
            onClick={onSetMain}
            className="bg-[#CB2030] text-white rounded-full p-1.5 hover:bg-[#b81c2a] shadow-md"
            title="Set as cover photo"
          >
            <Eye className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={onRemove}
          className="bg-gray-900 text-white rounded-full p-1.5 hover:bg-black shadow-md"
          title="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-gray-400 text-center truncate px-1">{image.name}</p>
    </div>
  );
}

/* ─── Image preview (review step, read-only) ─────────────── */
function ReviewImagePreview({ image, index, isMain }: { image: File; index: number; isMain: boolean }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    const r = new FileReader();
    r.onload = (e) => setSrc(e.target?.result as string);
    r.readAsDataURL(image);
  }, [image]);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border-2 bg-gray-100 transition-all"
      style={{ borderColor: isMain ? '#CB2030' : '#E5E7EB' }}
    >
      {src
        ? <img src={src} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center"><Camera className="w-5 h-5 text-gray-300" /></div>
      }
      {isMain && (
        <span className="absolute top-1.5 left-1.5 bg-[#CB2030] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          Cover
        </span>
      )}
    </div>
  );
}

/* ─── Shared nav buttons ─────────────────────────────────── */
function NavButtons({
  onPrev, onNext, onSubmit, isSubmitting, canProceed, isLast, isFirst,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canProceed?: boolean;
  isLast?: boolean;
  isFirst?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-100">
      {!isFirst ? (
        <button
          onClick={onPrev}
          className="flex items-center gap-2 h-11 px-5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      ) : <div />}

      {isLast ? (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Submit Listing
            </>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={canProceed === false}
          className="flex items-center gap-2 h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ─── Step 1: Contact & Category ────────────────────────── */
function Step1({ formData, update, onNext }: {
  formData: FormData;
  update: (k: keyof FormData, v: any) => void;
  onNext: () => void;
}) {
  const canProceed = !!(formData.sellerName && formData.sellerPhone && formData.sellerEmail && formData.category);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-0.5">Your contact details</h2>
        <p className="text-sm text-gray-500">Dealers will use this info to reach you about your listing.</p>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}><User className="inline w-3 h-3 mr-1" />Full Name *</label>
          <input
            className={inputCls}
            value={formData.sellerName}
            onChange={(e) => update('sellerName', e.target.value)}
            placeholder="e.g. John Doe"
            autoComplete="name"
          />
        </div>
        <div>
          <label className={labelCls}><Phone className="inline w-3 h-3 mr-1" />Phone Number *</label>
          <input
            className={inputCls}
            type="tel"
            value={formData.sellerPhone}
            onChange={(e) => update('sellerPhone', e.target.value)}
            placeholder="+264 81 123 4567"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className={labelCls}><Mail className="inline w-3 h-3 mr-1" />Email Address *</label>
          <input
            className={inputCls}
            type="email"
            value={formData.sellerEmail}
            onChange={(e) => update('sellerEmail', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelCls}><MapPin className="inline w-3 h-3 mr-1" />Location</label>
          <input
            className={inputCls}
            value={formData.sellerLocation}
            onChange={(e) => update('sellerLocation', e.target.value)}
            placeholder="e.g. Windhoek, Namibia"
            autoComplete="address-level2"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelCls}>Vehicle Category *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            const selected = formData.category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update('category', key)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-[#CB2030] bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {selected && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-[#CB2030]" />
                )}
                <Icon className={`w-7 h-7 ${selected ? 'text-[#CB2030]' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-xs font-bold leading-tight ${selected ? 'text-[#CB2030]' : 'text-gray-800'}`}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{cat.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        {!formData.category && (
          <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Select a category to continue
          </p>
        )}
      </div>

      <NavButtons isFirst onNext={onNext} canProceed={canProceed} />
    </div>
  );
}

/* ─── Step 2: Vehicle Details ────────────────────────────── */
function Step2({ formData, update, onNext, onPrev }: {
  formData: FormData;
  update: (k: keyof FormData, v: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [customMake, setCustomMake] = useState(!POPULAR_MANUFACTURERS.includes(formData.manufacturer) && !!formData.manufacturer);
  const categoryName = CATEGORIES[formData.category as keyof typeof CATEGORIES]?.name || 'Vehicle';
  const isCar   = formData.category === 'cars';
  const isTruck = formData.category === 'trucks';
  const isBike  = formData.category === 'bikes';
  const canProceed = !!(formData.manufacturer && formData.model && formData.year && formData.price);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-0.5">{categoryName} details</h2>
        <p className="text-sm text-gray-500">Tell us about your {categoryName.toLowerCase()}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Manufacturer */}
        <div>
          <label className={labelCls}>Manufacturer *</label>
          <select
            className={selectCls}
            value={customMake ? 'Other' : (formData.manufacturer || '')}
            onChange={(e) => {
              if (e.target.value === 'Other') {
                setCustomMake(true);
                update('manufacturer', '');
              } else {
                setCustomMake(false);
                update('manufacturer', e.target.value);
              }
            }}
          >
            <option value="">Select make</option>
            {POPULAR_MANUFACTURERS.map((m) => <option key={m} value={m}>{m}</option>)}
            <option value="Other">Other…</option>
          </select>
          {customMake && (
            <input
              className={`${inputCls} mt-2`}
              value={formData.manufacturer}
              onChange={(e) => update('manufacturer', e.target.value)}
              placeholder="Enter manufacturer name"
              autoFocus
            />
          )}
        </div>

        {/* Model */}
        <div>
          <label className={labelCls}>Model *</label>
          <input
            className={inputCls}
            value={formData.model}
            onChange={(e) => update('model', e.target.value)}
            placeholder="e.g. Hilux, X5, Camry"
          />
        </div>

        {/* Year */}
        <div>
          <label className={labelCls}>Year *</label>
          <select
            className={selectCls}
            value={formData.year}
            onChange={(e) => update('year', e.target.value)}
          >
            <option value="">Select year</option>
            {Array.from({ length: 35 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className={labelCls}>Asking Price (N$) *</label>
          <input
            className={inputCls}
            type="number"
            value={formData.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="e.g. 250000"
            min="0"
          />
        </div>

        {/* Mileage */}
        {(isCar || isTruck || isBike) && (
          <div>
            <label className={labelCls}>Mileage (km)</label>
            <input
              className={inputCls}
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => update('mileage', e.target.value)}
              placeholder="e.g. 45000"
              min="0"
            />
          </div>
        )}

        {/* Engine */}
        {(isCar || isTruck) && (
          <div>
            <label className={labelCls}>Engine Capacity</label>
            <input
              className={inputCls}
              value={formData.engineCapacity || ''}
              onChange={(e) => update('engineCapacity', e.target.value)}
              placeholder="e.g. 2.0L, 3.5L"
            />
          </div>
        )}

        {/* Fuel Type */}
        {(isCar || isTruck) && (
          <div>
            <label className={labelCls}>Fuel Type</label>
            <select
              className={selectCls}
              value={formData.fuelType || ''}
              onChange={(e) => update('fuelType', e.target.value)}
            >
              <option value="">Select fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        )}

        {/* Transmission */}
        {(isCar || isTruck) && (
          <div>
            <label className={labelCls}>Transmission</label>
            <select
              className={selectCls}
              value={formData.transmission || ''}
              onChange={(e) => update('transmission', e.target.value)}
            >
              <option value="">Select transmission</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        )}

        {/* Body Type */}
        {isCar && (
          <div>
            <label className={labelCls}>Body Type</label>
            <select
              className={selectCls}
              value={formData.bodyType || ''}
              onChange={(e) => update('bodyType', e.target.value)}
            >
              <option value="">Select body type</option>
              <option value="sedan">Sedan</option>
              <option value="hatchback">Hatchback</option>
              <option value="suv">SUV</option>
              <option value="bakkie">Bakkie / Pickup</option>
              <option value="coupe">Coupe</option>
              <option value="wagon">Station Wagon</option>
              <option value="convertible">Convertible</option>
              <option value="minivan">Minivan</option>
            </select>
          </div>
        )}

        {/* Doors */}
        {isCar && (
          <div>
            <label className={labelCls}>Number of Doors</label>
            <select
              className={selectCls}
              value={formData.doors || ''}
              onChange={(e) => update('doors', e.target.value)}
            >
              <option value="">Select doors</option>
              <option value="2">2 doors</option>
              <option value="3">3 doors</option>
              <option value="4">4 doors</option>
              <option value="5">5 doors</option>
            </select>
          </div>
        )}

        {/* Condition */}
        <div>
          <label className={labelCls}>Condition</label>
          <select
            className={selectCls}
            value={formData.condition || ''}
            onChange={(e) => update('condition', e.target.value)}
          >
            <option value="">Select condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={textareaCls}
          rows={4}
          value={formData.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Describe the vehicle's condition, service history, and any additional details buyers should know…"
        />
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} canProceed={canProceed} />
    </div>
  );
}

/* ─── Step 3: Features ───────────────────────────────────── */
function Step3({ formData, update, onNext, onPrev }: {
  formData: FormData;
  update: (k: keyof FormData, v: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const toggle = (f: string) => {
    const list = formData.features || [];
    update('features', list.includes(f) ? list.filter((x) => x !== f) : [...list, f]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-0.5">Features & options</h2>
        <p className="text-sm text-gray-500">Select all features your vehicle has. You can skip if none apply.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {AVAILABLE_FEATURES.map((f) => {
          const selected = formData.features?.includes(f);
          return (
            <button
              key={f}
              type="button"
              onClick={() => toggle(f)}
              className={`relative flex items-center gap-2 px-3 py-3 rounded-lg border-2 text-left text-xs font-medium transition-all ${
                selected
                  ? 'border-[#CB2030] bg-red-50 text-[#CB2030]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected ? 'bg-[#CB2030] border-[#CB2030]' : 'border-gray-300'
              }`}>
                {selected && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {f}
            </button>
          );
        })}
      </div>

      {formData.features.length > 0 && (
        <p className="text-xs text-gray-400">
          {formData.features.length} feature{formData.features.length !== 1 ? 's' : ''} selected
        </p>
      )}

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

/* ─── Step 4: Photos ─────────────────────────────────────── */
function Step4({ formData, update, onNext, onPrev }: {
  formData: FormData;
  update: (k: keyof FormData, v: any) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [dragging, setDragging] = useState(false);

  const addFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    if (imgs.length) update('images', [...formData.images, ...imgs]);
  };

  const remove = (i: number) => {
    const updated = formData.images.filter((_, idx) => idx !== i);
    update('images', updated);
    if (formData.mainImageIndex === i) update('mainImageIndex', 0);
    else if (formData.mainImageIndex > i) update('mainImageIndex', formData.mainImageIndex - 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-0.5">Upload photos</h2>
        <p className="text-sm text-gray-500">
          Good photos get more enquiries. Add up to 20 images — the first is your cover photo.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragging ? 'border-[#CB2030] bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Camera className="w-7 h-7 text-gray-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">
          {dragging ? 'Release to upload' : 'Drag & drop photos here'}
        </h3>
        <p className="text-xs text-gray-400 mb-5">or click to browse — JPG, PNG, WebP up to 10MB each</p>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files || []))}
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center gap-2 h-10 px-5 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4" /> Choose Photos
        </label>
      </div>

      {/* Previews */}
      {formData.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900">
              {formData.images.length} photo{formData.images.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-gray-400">Hover a photo to set it as cover or remove it</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {formData.images.map((img, i) => (
              <ImagePreview
                key={i}
                image={img}
                index={i}
                onRemove={() => remove(i)}
                isMain={formData.mainImageIndex === i}
                onSetMain={() => update('mainImageIndex', i)}
              />
            ))}
          </div>
        </div>
      )}

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </div>
  );
}

/* ─── Step 5: Review & Submit ────────────────────────────── */
function Step5({ formData, onSubmit, onPrev, isSubmitting }: {
  formData: FormData;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}) {
  const categoryName = CATEGORIES[formData.category as keyof typeof CATEGORIES]?.name || 'Vehicle';

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: string }) =>
    value ? (
      <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-100 last:border-0">
        <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
        <span className="text-xs font-medium text-gray-900 text-right capitalize">{value}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-0.5">Review your listing</h2>
        <p className="text-sm text-gray-500">Please confirm everything looks correct before submitting.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Contact Information">
          <Row label="Name" value={formData.sellerName} />
          <Row label="Phone" value={formData.sellerPhone} />
          <Row label="Email" value={formData.sellerEmail} />
          <Row label="Location" value={formData.sellerLocation} />
        </Section>

        <Section title="Vehicle Details">
          <Row label="Category" value={categoryName} />
          <Row label="Make" value={formData.manufacturer} />
          <Row label="Model" value={formData.model} />
          <Row label="Year" value={formData.year} />
          <Row label="Price" value={`N$ ${Number(formData.price).toLocaleString()}`} />
          <Row label="Mileage" value={formData.mileage ? `${Number(formData.mileage).toLocaleString()} km` : undefined} />
          <Row label="Engine" value={formData.engineCapacity} />
          <Row label="Fuel" value={formData.fuelType} />
          <Row label="Transmission" value={formData.transmission} />
          <Row label="Body" value={formData.bodyType} />
          <Row label="Condition" value={formData.condition} />
        </Section>
      </div>

      {formData.description && (
        <Section title="Description">
          <p className="text-sm text-gray-700 leading-relaxed">{formData.description}</p>
        </Section>
      )}

      {formData.features.length > 0 && (
        <Section title={`Features (${formData.features.length})`}>
          <div className="flex flex-wrap gap-1.5">
            {formData.features.map((f) => (
              <span key={f} className="inline-flex items-center h-6 px-2.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700 font-medium">
                {f}
              </span>
            ))}
          </div>
        </Section>
      )}

      {formData.images.length > 0 && (
        <Section title={`Photos (${formData.images.length})`}>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {formData.images.map((img, i) => (
              <ReviewImagePreview key={i} image={img} index={i} isMain={formData.mainImageIndex === i} />
            ))}
          </div>
        </Section>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Your listing will be reviewed by our team before going live. Verified dealers across Namibia will be able to contact you with offers. This is a <strong>free service</strong> — we never charge sellers.
        </p>
      </div>

      <NavButtons onPrev={onPrev} onSubmit={onSubmit} isSubmitting={isSubmitting} isLast />
    </div>
  );
}

/* ─── Root component ─────────────────────────────────────── */
export default function SellYourCarWizard() {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sellerName: '', sellerPhone: '', sellerEmail: '', sellerLocation: '',
    category: '', manufacturer: '', model: '', year: '', price: '',
    description: '', features: [], images: [], mainImageIndex: 0,
  });

  const update = (field: keyof FormData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!formData.sellerName || !formData.manufacturer || !formData.model || !formData.year || !formData.price) {
      showToast({ title: 'Missing Information', description: 'Please fill in all required fields.', variant: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const imagePromises = formData.images.map(
        (img) => new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = (e) => resolve(e.target?.result as string);
          r.readAsDataURL(img);
        })
      );
      const imageStrings = await Promise.all(imagePromises);

      const categoryMap: Record<string, string> = {
        cars: 'CARS', trucks: 'TRUCKS', bikes: 'MOTORCYCLES',
        buses: 'BUSES', machinery: 'INDUSTRIAL_MACHINERY',
        tractors: 'TRACTORS', boats: 'BOATS', accessories: 'ACCESSORIES',
      };

      const response = await fetch('/api/sell-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:     categoryMap[formData.category] || 'CARS',
          make:         formData.manufacturer,
          model:        formData.model,
          year:         formData.year,
          price:        formData.price,
          mileage:      formData.mileage || '',
          transmission: formData.transmission || '',
          fuelType:     formData.fuelType || '',
          color:        '',
          condition:    formData.condition || 'Good',
          description:  formData.description || 'No description provided',
          images:       imageStrings,
          negotiable:   true,
          hasAccident:  false,
          serviceHistory: true,
          availableForTest: true,
          city:         formData.sellerLocation || '',
          region:       '',
          userName:     formData.sellerName,
          userEmail:    formData.sellerEmail,
          userPhone:    formData.sellerPhone,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit listing');

      showToast({
        title: 'Listing Submitted!',
        description: 'Your listing is under review and will be visible to dealerships once approved.',
        variant: 'success',
        duration: 7000,
      });

      setFormData({
        sellerName: '', sellerPhone: '', sellerEmail: '', sellerLocation: '',
        category: '', manufacturer: '', model: '', year: '', price: '',
        description: '', features: [], images: [], mainImageIndex: 0,
      });
      setStep(1);
    } catch (err: any) {
      showToast({
        title: 'Submission Failed',
        description: err.message || 'Please try again.',
        variant: 'error',
        duration: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Page header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#CB2030] mb-4 shadow-sm">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">List Your Vehicle</h1>
          <p className="text-sm text-gray-500">Reach hundreds of verified dealers across Namibia — for free.</p>
        </div>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Track line behind steps */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }}>
              <div
                className="h-full bg-[#CB2030] transition-all duration-300"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STEPS.map(({ n, label }) => {
              const done    = n < step;
              const current = n === step;
              return (
                <div key={n} className="flex flex-col items-center gap-1.5 relative" style={{ zIndex: 1 }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done
                      ? 'bg-[#CB2030] border-[#CB2030] text-white'
                      : current
                        ? 'bg-white border-[#CB2030] text-[#CB2030]'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {done ? <CheckCircle className="w-4 h-4" /> : n}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:block ${
                    current ? 'text-[#CB2030]' : done ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {step === 1 && <Step1 formData={formData} update={update} onNext={next} />}
          {step === 2 && <Step2 formData={formData} update={update} onNext={next} onPrev={prev} />}
          {step === 3 && <Step3 formData={formData} update={update} onNext={next} onPrev={prev} />}
          {step === 4 && <Step4 formData={formData} update={update} onNext={next} onPrev={prev} />}
          {step === 5 && <Step5 formData={formData} onSubmit={handleSubmit} onPrev={prev} isSubmitting={isSubmitting} />}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-[#CB2030] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-[#CB2030] hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
