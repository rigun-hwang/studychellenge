

'use client'
import { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/firebase/firebasedb'
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSignIn = async () => {
    try {
        if (!email ||!password) {
          return;
        }
        setLoading(true)
        const res = await signInWithEmailAndPassword(email, password);
        console.log(res);
        sessionStorage.setItem('user', "true")
        setEmail('');
        setPassword('');
        router.push('/')
    }catch(e){
        console.error(e)
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-blue-950">Study Challenge</h1>
          <p className="text-sm text-blue-600">AI 기반 맞춤형 학습 관리 플랫폼</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-center text-xl font-bold text-blue-950 mb-6">로그인</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                placeholder="이메일"
                className="w-full h-11 px-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e)=>{setEmail(e.target.value)}}
              />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full h-11 px-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
            <button
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              onClick={handleSignIn}
              disabled={loading}
            >
              로그인
            </button>
          </div>
          <div className="mt-4 text-center mb-4">
            <p className="text-blue-600 text-sm">
              계정이 없으신가요? <a href="/signup">회원가입</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;