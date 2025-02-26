"use client";

import React, { useRef, useEffect } from "react";
import confetti from "canvas-confetti"; // 여기서 canvas-confetti를 사용!

export default function FireworksButton() {
  const refAnimationInstance = useRef(null);

  useEffect(() => {
    // confetti 인스턴스 생성
    refAnimationInstance.current = confetti.create(null, { resize: true, useWorker: true });
  }, []);

  const fire = () => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div>
      <button onClick={fire} className="p-4 bg-blue-500 text-white rounded">
        성공! 🎉
      </button>
    </div>
  );
}
