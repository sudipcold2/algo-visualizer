"use client";

import { useEffect } from "react";

export default function AdBanner({ dataAdSlot, dataAdFormat = "auto", dataFullWidthResponsive = true }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, []);

  return (
    <div className="w-full text-center overflow-hidden my-4 border border-dashed border-white/10 rounded-lg bg-black/20 relative group">
      {/* Fallback/Placeholder when Ads are blocked or not loaded */}
      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-medium uppercase tracking-widest pointer-events-none -z-10 group-hover:text-white/30 transition-colors">
        Advertisement
      </div>
      
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
}
