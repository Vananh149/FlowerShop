import React from 'react';

export default function PromoMarquee() {
  const messages = [
    "Miễn phí giao hàng cho đơn trên 500k",
    "Giao hoa nhanh trong 2h tại TP.HCM & Hà Nội",
    "Giảm 10% cho khách hàng mới với mã FLORENEW"
  ];
  
  const marqueeItems = [...messages, ...messages];

  return (
    <div className="bg-flore-pink/30 py-3 border-y border-flore-pink/50 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee hover:animation-play-state-paused flex items-center">
        {marqueeItems.map((msg, idx) => (
          <span key={idx} className="mx-8 text-sm font-medium text-flore-accent uppercase tracking-wider">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
