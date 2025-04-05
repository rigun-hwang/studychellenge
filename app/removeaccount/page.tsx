/* eslint-disable */

'use client';
import { useState } from 'react';

export default function DeleteAccountPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = (window as any).grecaptcha.getResponse();

    const form = new FormData(e.target);
    form.append('g-recaptcha-response', token);

    const res = await fetch('/api/delete-request', {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('요청 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
        <h1>🔐 계정 및 데이터 삭제 요청 안내</h1>
        <p>
        저희 앱은 사용자 개인정보 보호를 위해, 언제든지 계정 및 관련 데이터를 삭제 요청하실 수 있도록 지원하고 있습니다.
        </p>

        <h2>📌 삭제 요청 방법</h2>
        <p>다음 정보를 포함하여 아래 이메일로 요청해 주세요:</p>
        <ul>
        <li>이메일 제목: <strong>계정 삭제 요청</strong></li>
        <li>본문 내용: 가입 시 사용한 이메일 주소 또는 사용자 ID</li>
        <li>요청 이유 (선택사항)</li>
        </ul>

        <p>
        삭제 요청 이메일 주소:  
        <div class="email-box">
            📧 <a href="mailto:rigun.hwang@email.com">rigun.hwang@email.com</a>
        </div>
        </p>

        <h2>⏱ 처리 시간 안내</h2>
        <p>
        요청이 접수되면, 보통 <strong>영업일 기준 4일 이내</strong>에 계정과 관련 데이터가 모두 삭제됩니다. 처리 완료 시 확인 메일을 보내드립니다.
        </p>

        <p>
        추가 문의사항이 있는 경우 언제든지 연락 주세요.<br />
        감사합니다.
    </p>
  </div>
  );
}
