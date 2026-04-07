'use client';

import { useEffect, useState } from 'react';

interface StickySidebarAdProps {
  slot: string;
}

export default function StickySidebarAd({ slot }: StickySidebarAdProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Placeholder for ad initialization
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div className="sticky top-4">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
        />
        {!adLoaded && (
          <div className="text-gray-400 text-sm">
            <p>Advertisement</p>
            <p className="text-xs mt-1">Sticky Sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}
