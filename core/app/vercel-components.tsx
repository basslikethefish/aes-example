'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState } from 'react';

export function VercelComponents() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only render on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Don't load Vercel scripts in Makeswift's iframe/preview to avoid 404 errors
    // Check if we're in an iframe (Makeswift preview)
    const isInIframe = window.self !== window.top;

    // Also check for Makeswift-specific indicators
    const isMakeswiftContext =
      window.location.search.includes('makeswift') ||
      window.location.href.includes('makeswift') ||
      document.referrer.includes('makeswift');

    // Only render if we're NOT in an iframe and NOT in Makeswift context
    if (!isInIframe && !isMakeswiftContext) {
      setShouldRender(true);
    }
  }, []);

  if (!shouldRender || process.env.VERCEL !== '1') {
    return null;
  }

  return (
    <>
      {process.env.DISABLE_VERCEL_ANALYTICS !== 'true' && <Analytics />}
      {process.env.DISABLE_VERCEL_SPEED_INSIGHTS !== 'true' && <SpeedInsights />}
    </>
  );
}

