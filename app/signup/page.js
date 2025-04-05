/* eslint-disable */

'use client'
import { useState } from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/firebase/firebasedb'
import { updateProfile } from 'firebase/auth'
import {useRouter} from 'next/navigation'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import fireStore from "@/firebase/firestore"

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [failMessage, setFailMessage] = useState('');
  const [age, setAge] = useState();
  const [alreadyLogged, setAlreadyLogged] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function LoadData() {
    try {
      if (!auth.currentUser) {
        setIsLoading(true);
        return;
      }
  
      const userEmail = auth.currentUser.email;
      const userName = auth.currentUser.displayName;
      setLoading(true)
      // 'userData' 컬렉션에서 현재 유저의 이메일이 존재하는지 확인
      const querySnapshot = await getDocs(collection(fireStore, 'userData'));
      const isUserExists = querySnapshot.docs.some(doc => doc.data().email === userEmail);
      
      if (isUserExists) {
        setFailMessage("이미 계정이 있습니다.");
        router.push("/signin");
        return;
      }
  
      // 새 계정 추가
      setIsLoading(true);
      await addDoc(collection(fireStore, "userData"), {
        dailyStreak: 1,
        email: userEmail,
        friends: [],
        isStudying: false,
        level: 1,
        point: 0,
        todayTasks: [
          { completed: false, challenging : false, id: 1, points: 0, title: "눌러서 입력!", images:[], imagesAfter : [] },
          { completed: false, challenging : false, id: 2, points: 0, title: "눌러서 입력!", images:[], imagesAfter : [] },
          { completed: false, challenging : false, id: 3, points: 0, title: "눌러서 입력!", images:[], imagesAfter : [] }
        ],
        weeklyProgress: [
          { day: "월", minutes: 0, todayTasks: [""]},
          { day: "화", minutes: 0, todayTasks: [""] },
          { day: "수", minutes: 0, todayTasks: [""] },
          { day: "목", minutes: 0, todayTasks: [""] },
          { day: "금", minutes: 0, todayTasks: [""] },
          { day: "토", minutes: 0, todayTasks: [""] },
          { day: "일", minutes: 0, todayTasks: [""] }
        ],
        username: userName,
        age: age,
      });
  
      sessionStorage.setItem('user', "true");
      setEmail('');
      setPassword('');
      setName('');
      router.push('/');
    } catch (error) {
      console.error("데이터 로딩 중 오류:", error);
    }
  }
  

  const handleSignUp = async () => {
    try {

        if (!email ||!password ||!name || !age) {
          setFailMessage('모든 항목을 체워주세요!');
          return;
        }
        
        const res = await createUserWithEmailAndPassword(email, password)
                
        await updateProfile(auth.currentUser, {
          displayName : name,
        })
        LoadData()


    } catch(error){
      console.log(error)
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
          <h2 className="text-center text-xl font-bold text-blue-950 mb-6">회원가입</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="이름"
                className="w-full h-11 px-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e)=>{setName(e.target.value)}}
              />
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
              <input
                type="number"
                placeholder="나이"
                className="w-full h-11 px-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e)=>{setAge(e.target.value)}}
              />
              {/* <input
                type="password"
                placeholder="비밀번호 확인"
                className="w-full h-11 px-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              /> */}
            </div>
            <button
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={loading}
              onClick={handleSignUp}
            >
              회원가입
            </button>
          </div>
          <div className="mt-4 text-center mb-4">
            <p className="text-blue-600 text-sm">
              이미 계정이 있으신가요? <a href="/signin">로그인</a>
            </p>
            <p className="text-red-600 text-xl">
              {failMessage}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;