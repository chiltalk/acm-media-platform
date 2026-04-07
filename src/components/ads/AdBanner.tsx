'use client';

import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  slot: string;
  size?: 'leaderboard' | 'rectangle' | 'skyscraper';
  className?: string;
}

const sizes = {
  leaderboard: { width: '728px', height: '90px' },
  rectangle: { width: '300px', height: '250px' },
  skyscraper: { width: '160px', height: '600px' },
};

export default function AdBanner({ slot, size = 'rectangle', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Placeholder for ad initialization
    // In production, this would initialize Google AdSense or other ad networks
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={sizes[size]}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
      />
      {!adLoaded && (
        <div className="text-center text-gray-400 text-sm p-4">
          <p>Advertisement</p>
          <p className="text-xs mt-1">{size}</p>
        </div>
      )}
    </div>
  );
}
