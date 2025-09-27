'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  position: string;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
  impressions: number;
}

interface DynamicBannerProps {
  position: string;
  className?: string;
  fallbackContent?: React.ReactNode;
}

export function DynamicBanner({ position, className = '', fallbackContent }: DynamicBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  useEffect(() => {
    // Track impression when banner is loaded
    if (banners.length > 0 && banners[currentBannerIndex]) {
      trackImpression(banners[currentBannerIndex].id);
    }
  }, [banners, currentBannerIndex]);

  useEffect(() => {
    // Auto-rotate banners if there are multiple
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 10000); // Change banner every 10 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`/api/banners?position=${position}`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (bannerId: string) => {
    try {
      await fetch(`/api/banners/${bannerId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'impression' }),
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (bannerId: string) => {
    try {
      await fetch(`/api/banners/${bannerId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'click' }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleBannerClick = (banner: Banner) => {
    trackClick(banner.id);
    if (banner.linkUrl) {
      window.open(banner.linkUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return fallbackContent ? <>{fallbackContent}</> : null;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <div className={className}>
      <div className="rounded-lg overflow-hidden shadow-sm border border-neutral-200 relative">
        <div
          className="relative min-h-[200px]"
          style={{
            backgroundColor: currentBanner.backgroundColor || '#1F3469'
          }}
        >
          {currentBanner.imageUrl && (
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backgroundColor: currentBanner.backgroundColor || '#1F3469',
              opacity: currentBanner.overlayOpacity || 0.5
            }}
          >
            <div className="text-center bg-white/95 p-8 rounded-lg backdrop-blur-sm max-w-md shadow-lg">
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: currentBanner.textColor || '#1F3469' }}
              >
                {currentBanner.title}
              </h3>

              {currentBanner.subtitle && (
                <h4
                  className="text-lg font-semibold mb-3"
                  style={{ color: currentBanner.textColor || '#1F3469' }}
                >
                  {currentBanner.subtitle}
                </h4>
              )}

              {currentBanner.description && (
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  {currentBanner.description}
                </p>
              )}

              {currentBanner.buttonText && currentBanner.linkUrl && (
                <Button
                  size="sm"
                  className="hover:bg-[#3B4F86]"
                  style={{
                    backgroundColor: currentBanner.textColor || '#1F3469',
                    color: currentBanner.backgroundColor || '#FFFFFF'
                  }}
                  onClick={() => handleBannerClick(currentBanner)}
                >
                  {currentBanner.buttonText}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Banner indicators if multiple banners */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentBannerIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Show banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Auto-rotation progress indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div
              className="h-full bg-white/50 transition-all duration-[10000ms] ease-linear"
              style={{
                width: '0%',
                animation: 'bannerProgress 10s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bannerProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}