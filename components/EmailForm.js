/*eslint-disable */

// components/EmailForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const initialContact = {
  from: '',
  title: '',
  content: '',
};
export default function EmailForm() {
  const [contact, setContact] = useState(initialContact);
  const [file, setFile] = useState();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contact, file); // 수정 예정 코드
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        제목
        <input
          required
          type="text"
          name="title"
          value={contact.title}
          onChange={onChange}
        />
      </label>
      <label>
        문의 내용
        <textarea
          required
          name="content"
          rows={10}
          value={contact.content}
          onChange={onChange}
        />
      </label>
      <label>
        이메일
        <input
          required
          type="text"
          name="from"
          value={contact.from}
          onChange={onChange}
        />
      </label>
      <label>
        첨부 파일
        <div>
          <div>
            <input
              type="file"
              name="file"
			  accept="image/*"
              onChange={} // 수정 예정 코드 
            />
            {file && (
              <Image
                src={file}
                alt="local file"
                width="70"
                height="70"
              />
            )}
          </div>
        </div>
      </label>
      <button>작성 완료</button>
    </form>
  );
}
