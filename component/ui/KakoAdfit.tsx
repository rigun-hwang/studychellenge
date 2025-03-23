/* eslint-disable */
'use client'
import React, { useState, useRef, useEffect } from 'react';

export default function AdFitBanner() {
  useEffect(() => {
    // 광고 스크립트 다시 실행되도록 처리
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <ins className="kakao_ad_area"
      style={{ display: 'none' }}
      data-ad-unit="DAN-EBlG3E7SFYn9rzSR"
      data-ad-width="320"
      data-ad-height="100"
    />
  );
}
