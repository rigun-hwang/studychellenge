'use client';

import React, { useState } from 'react';
import AnimatedModal from '@/util/Modal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Prop 기반 모달 예제</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        모달 열기
      </button>

      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="✨ 타이틀입니다"
        description="이곳은 모달의 설명 또는 본문입니다. 텍스트는 props로 전달됩니다."
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
        >
          닫기
        </button>
      </AnimatedModal>
    </div>
  );
}
