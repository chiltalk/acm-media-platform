'use client';

import { useEffect, useState } from 'react';

interface InArticleAdProps {
  slot: string;
}

export default function InArticleAd({ slot }: InArticleAdProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Placeholder for ad initialization
    const timer = setTimeout(() => {
      setAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div className="my-8 mx-auto max-w-md">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <ins
          className="adsbygoogle block"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
        />
        {!adLoaded && (
          <div className="text-gray-400 text-sm">
            <p>Advertisement</p>
            <p className="text-xs mt-1">In-Article Ad</p>
          </div>
        )}
      </div>
    </div>
  );
}
