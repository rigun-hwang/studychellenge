/* eslint-disable */

'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trophy, Users, BarChart2, Star, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../component/ui/card'
import fireStore from "@/firebase/firestore"
import { collection, getDocs, query, where, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import { CircleDollarSign } from 'lucide-react';
import { auth } from '@/firebase/firebasedb'
import { useRouter } from 'next/navigation'
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { GoogleGenerativeAI } from "@google/generative-ai";
import AnimatedModal from '@/util/Modal';
import 이미지 from './clock.png'
import confetti from "canvas-confetti"; // 여기서 canvas-confetti를 사용!

const truncateText = (text , maxLength = 8) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const convertImageToBase64 = async (file) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(file, {
      encoding: FileSystem.EncodingType.Base64,
    });
    runAI(base64)
    return base64
  } catch (error) {
    console.error("Error converting image to base64:", error);
  }
};

export default function StudyDashboard() {
  const [userDatas, setUserDatas] = useState(null);
  
  const [challengStartModel, setChallengStartModel] = useState(false);
  const [challengStartDes, setChallengDesModel] = useState("");
  const [challengEndModel, setChallengEndModel] = useState(false);
  const [challengEndDes, setChallengDesModelEnd] = useState("");
  const [userId, setUserId] = useState("");
  const [imageA, setImageA] = useState();
  const [imageB, setImageB] = useState([])
  const [result, setResult] = useState("");
  const router = useRouter();

  const [imageBase64, setImageBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageBase642, setImageBase642]  = useState(null); 
  const [completed, setCompleted] = useState(false)
  const refAnimationInstance = useRef(null);
  const [progress, setProgress] = useState({});
  function getWeekNumber(date) {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  useEffect(() => {
    LoadData()
  }, []);

  // 데이터 업데이트 함수
  const updateProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem("weeklyProgress", JSON.stringify(newProgress));
  };
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
  // const identifyImage = async (additionPrompt="", imageB, index) => {
  //   try {
  //     if (imageB) {
  //       const imageParts = await fileToGenerativePart(imageB);
  //       const result = await model.generateContent([
  //         additionPrompt,
  //         imageParts,
  //       ]);
  //       const response = await result.response;
  //       const text = await response.text();
  //       setResult(text.trim());
  //       console.log(text.trim())
  //       updatedData(index, text.trim())
  //     }
  //   } catch (error) {
  //     console.log((error)?.message);
  //   }
  // };
  const identifyImageA = async (additionPrompt="", imageB,imageC, index) => {
    try {
      if (imageB) {
        
        const imageParts = await fileToGenerativePart(imageB);
        const imageParts2 = await fileToGenerativePart(imageC);
        console.log(imageC)
        const result = await model.generateContent([
          imageParts,
          imageParts2,
          '첫 이미지는 공부하기전이고, 두번째 이미지는 공부한 후 이미지야. 공부가 100%완료 되었다고 판단이 되면 "true", 없거나 공부와 관련이 없으면 "false"만 출력하세요.',
        ]);
        console.log("index : " +index)
        const response = await result.response;
        const text = await response.text();
        if (text.trim() == 'true'){
          updateCompleted(index, true)
          fire()
          updateUsersPoint(index, Number(userDatas.todayTasks[index].points))
        }else{
          alert("챌린지 실패!, 다시 시도하거나 포기하고싶으면 아래의 버튼을 눌러주세요")
        }
        console.log(text.trim())

      }
    } catch (error) {
      console.log((error)?.message);
    }
  };
  const identifyImageDifficulty = async (additionPrompt = "", imageB, index) => {
    try {
      if (imageB) {
        
        const imageParts = await fileToGenerativePart(imageB);
        const result = await model.generateContent([
          `다음 문제의 난이도를 ${userDatas.age}살 기준으로 평가해 주세요.
          오직 0~10 사이의 숫자로만 답변하세요. 추가 설명 없이 숫자만 출력하세요.
          
          문제 이미지: `,
          imageParts
        ]);
        console.log("index : " +index)
        const response = await result.response;
        const text = await response.text();

        console.log(text.trim())
        updatePoint(index, text.trim())
      }
    } catch (error) {
      console.log((error)?.message);
    }
  };
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        const base64Content = base64Data.split(",")[1];
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const updateTaskImage = async (newImage, taskIndex) => {
    try {
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
  
      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task,
            images: [newImage], // 기존 이미지에 새로운 이미지 추가
          };
        }
        return task;
      });
  
      // Firestore 업데이트
      await updateDoc(userDocRef, { todayTasks: updatedTasks });
  
      console.log("✅ 업데이트 성공!", updatedTasks);

      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  function blobToFile(blob, fileName) {
    return new File([blob], fileName, { type: blob.type });
  }
  const StartChallenge = async (taskIndex) => {
    try {
      let flag = false;
      userDatas.todayTasks.map((task) =>{
        console.log("complete : " + task.completed)
        if(task.challenging == true && flag != true){
          alert("지금 하고 있는 챌린지를 먼저 완료해주세요.")
          flag = true;
        }
      })
      if (userDatas.todayTasks[taskIndex].completed == true)
      {
        alert("이미 완료된 챌린지 입니다.")
        flag = true;
      }
      if (flag == true)
        return;
      
      setImageA( )
      setImageB( )
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
  
      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task, // 기존 이미지에 새로운 이미지 추가
            challenging : true,
            startTime : new Date().toLocaleTimeString(),   
          };
        }
        return task;
      });
     
      // Firestore 업데이트
      await updateDoc(userDocRef, { todayTasks: updatedTasks });

      setChallengDesModel(new Date().toLocaleTimeString()[3]+"시"+" " + new Date().toLocaleTimeString()[5]+ new Date().toLocaleTimeString()[6]+"분" + "챌린지 시작!")
      console.log("✅ 업데이트 성공!", updatedTasks);
      setChallengStartModel(true)
      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const updatedData = async (taskIndex,res) => {
    try {
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
  
      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task, // 기존 이미지에 새로운 이미지 추가
            title: res, 
          };
        }
        return task;
      });
     
      // Firestore 업데이트

      
      // alert(new Date().toLocaleTimeString()[3]+"시"+" " + new Date().toLocaleTimeString()[5]+ new Date().toLocaleTimeString()[6]+"분" + "챌린지 시작!")
      console.log("✅ 업데이트 성공!", updatedTasks);

      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const updateCompleted = async (taskIndex,res) => {
    try {
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
      console.log(taskIndex)
      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task, // 기존 이미지에 새로운 이미지 추가
            completed: true,
            challenging : false,
            end:new Date().toLocaleTimeString(),
          };
        }
        return task;
      });
      const dayNames = ["월", "화", "수", "목","금","토","일"]
      const updatedProgress = userData.weeklyProgress.map((task, index) => {
        if (userDatas.weeklyProgress[index].day == dayNames[Number(new Date().getDay())]){
          return{
            ...task,
            minutes : task.minutes + (Number(new Date().toLocaleTimeString()[3])-Number(updatedTasks[taskIndex].startTime[3])) * 60 + Number((new Date().toLocaleTimeString()[5]+new Date().toLocaleTimeString()[6])-(updatedTasks[taskIndex].startTime[5]+updatedTasks[taskIndex].startTime[6]))
          }
        }else{
          return {
            ...task,
            minutes : 0
          }
        }
      });
      console.log((Number(new Date().toLocaleTimeString()[3])-Number(updatedTasks[taskIndex].startTime[3])) * 60 + Number((new Date().toLocaleTimeString()[5]+new Date().toLocaleTimeString()[6])-(updatedTasks[taskIndex].startTime[5]+updatedTasks[taskIndex].startTime[6])))
      // Firestore 업데이트
      await updateDoc(userDocRef, { todayTasks: updatedTasks });
      await updateDoc(userDocRef, { weeklyProgress: updatedProgress });
      console.log()

      console.log("✅ 업데이트 성공!", updatedTasks);
      setChallengDesModelEnd(new Date().toLocaleTimeString()[3]+"시"+" " + new Date().toLocaleTimeString()[5]+ new Date().toLocaleTimeString()[6]+"분" + "챌린지 종료!")
      setChallengEndModel(true)
      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const updatePoint = async (taskIndex,res) => {
    try {
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
      console.log(taskIndex)
      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task, // 기존 이미지에 새로운 이미지 추가
            points: res,
            
          };
        }
        return task;
      });
  
      // Firestore 업데이트
      await updateDoc(userDocRef, { todayTasks: updatedTasks });
  
      console.log("✅ 업데이트 성공!", updatedTasks);

      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const updateUsersPoint = async (taskIndex,res) => {
    try {
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();
      console.log(taskIndex)
      // 기존 todayTasks 배열을 업데이트

      // Firestore 업데이트
      await updateDoc(userDocRef, { point : String(Number(userDatas.point) + res) });
  
      console.log("✅ 업데이트 성공!");
      let count = 0;
      userDatas.todayTasks.map((task) =>{
        if (task.completed == true) { 
          count += 1;
        }
      })

      if (count == 2){
        alert("모든 챌린지를 완료 했으니 새로운 챌린지를 시작합니다!")
        reStart(taskIndex);
      }
      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const updateTaskImageA = async (newImage, taskIndex, file1, file2) => {
    try {

      console.log("test : " + file2)
      // Firestore에서 해당 userId의 문서 가져오기
      const userDocRef = doc(fireStore, "userData", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error("❌ 문서를 찾을 수 없음!");
        return;
      }
      
      const userData = userDocSnap.data();

      // 기존 todayTasks 배열을 업데이트
      const updatedTasks = userData.todayTasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task,
            imagesAfter: [newImage], // 기존 이 미지에 새로운 이미지 추가
          };
        }
        return task;
      });
  
      // Firestore 업데이트

      identifyImageA("",file1, file2, taskIndex)
      console.log("✅ 업데이트 성공!", updatedTasks);

      // 최신 데이터 다시 불러오기
      LoadData();
      
    } catch (error) {
      console.error("❌ 업데이트 실패:", error);
    }
  };
  const handleImageUpload = (index, event) => {
    let flag = false;

    if (flag == true) {
      return
    }
    if (userDatas.todayTasks[index].completed == true){
      alert("이미 완료된 챌린지 입니다. 내일 다시 시도 하세요.")
      return
    }
    if (userDatas.todayTasks[index].challenging != true){
      alert("먼저 챌린지를 시작해 주세요")
      return
    }
    const file = event.target.files?.[0]; // 첫 번째 파일 가져오기

    if (!file) {
      console.error("No file selected");
      return;
    }
    
    console.log("Selected file:", file); // 파일 로그 확인

    if (!(file instanceof Blob)) {
      console.error("File is not a valid Blob type");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    setImageA(file)
    identifyImageDifficulty(" ", file, index)
    reader.onloadend = () => {
      setImageBase64(reader.result);
      updateTaskImage(reader.result, index);
      console.log("Base64 Data:", reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };
  const reStart = async (index) => {
    const userDocRef = doc(fireStore, "userData", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error("❌ 문서를 찾을 수 없음!");
      return;
    }
    
    const userData = userDocSnap.data();

    // 기존 todayTasks 배열을 업데이트
    const updatedTasks = userData.todayTasks.map((task, index) => {
      return { completed: false, challenging : false, id: index + 1, points: 0, title: "눌러서 입력!", images:[], imagesAfter : [] };
      return task;
    });
   
    // Firestore 업데이트
    await updateDoc(userDocRef, { todayTasks: updatedTasks });    

    LoadData()
  }
  const handleImageUploadA = (index, event) => {
    let flag = false;

    if (flag == true) {
      return
    }
    // 첫 번째 파일 가져오기
    console.log("Excused")
    const file = event.target.files?.[0];
    if (userDatas.todayTasks[index].completed == true){
      alert("이미 완료된 챌린지 입니다. 내일 다시 시도 하세요.")
      return
    }
    if (userDatas.todayTasks[index].challenging != true){
      alert("먼저 챌린지를 시작해 주세요")
      return
    }
    if (!file) {
      console.error("No file selected");
      return;
    }
    
    console.log("Selected file:", file); // 파일 로그 확인

    if (!(file instanceof Blob)) {
      console.error("File is not a valid Blob type");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    setImageB(file)
    console.log("imageA : " + imageA)
    reader.onloadend = () => {
      setImageBase642(reader.result);
      updateTaskImageA(reader.result, index, imageA, file);
      console.log("Base64 Data:", reader.result);
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };
  async function LoadData(){
    try {
      const querySnapshot = await getDocs(collection(fireStore, "userData"));
      if (!querySnapshot.empty) {
        // auth.currentUser
        if (!auth.currentUser) {
          router.push("/signup");
          setIsLoading(true);
          return;
        }
        let id = ""

        setIsLoading(false);
        querySnapshot.docs.map((d) => {
          if (d.data().email === auth.currentUser.email) {
            setUserDatas(d.data());
            setUserId(d.id);
            id = d.id;
          }
        });
                // 현재 연도 및 주차 계산
        const now = new Date();
        const currentWeek = getWeekNumber(now);
        const lastWeek = parseInt(localStorage.getItem("lastUpdatedWeek"), 10) || 0;

        if (currentWeek !== lastWeek) {
                  // 새 주차가 시작되었으므로 초기화
                  // Firestore에서 해당 userId의 문서 가져오기
          const userDocRef = doc(fireStore, "userData", id);
          const userDocSnap = await getDoc(userDocRef);
              
          if (!userDocSnap.exists()) {
            console.error("❌ 문서를 찾을 수 없음!");
            return;
          }
                  
          const userData = userDocSnap.data();

          const dayNames = ["월", "화", "수", "목","금","토","일"]
          const updatedProgress = userData.weeklyProgress.map((task, index) => {
            return {
                ...task,
                minutes : 0
            }
                    
          });

          await updateDoc(userDocRef, { weeklyProgress: updatedProgress });
          localStorage.setItem("lastUpdatedWeek", currentWeek);
          setProgress({});
        } else {
                // 기존 데이터 불러오기
          const storedData = JSON.parse(localStorage.getItem("weeklyProgress")) || {};
          setProgress(storedData);
        }
        
      }



      console.log("✅ 업데이트 성공");
    } catch (error) {
      console.error("데이터 로딩 중 오류:", error);
    }
  };



  if (isLoading) {
    return <div>데이터를 불러오는 중...</div>;
  }
  function loadImage(index){
    if (userDatas.todayTasks[index].images[0] != null){
      setImageA(blobToFile(userDatas.todayTasks[index].images[0], "testName"))
      setImageBase64(userDatas.todayTasks[index].images[0]);
    }
  }

  function openChallenge(){
    setImageA( )
    setImageB( )
  }

  return (
  <div>
 

  <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <div className="p-6 max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-4">Study Challenge</h1>
          <p className="text-gray-600 mb-8">AI 기반 맞춤형 학습 관리 플랫폼</p>
          
          {/*  학습 시작하기*/}
          {/*</button>*/}
        </div>

        {/* 프로필 카드 */}
        <Card className="mb-8 bg-white/70 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {userDatas.username[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">{userDatas.username}</h2>
                    <Bell className="text-gray-600 cursor-pointer hover:text-blue-600 ml-4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                    <Trophy size={16} className="text-blue-600" />
                      <span className="text-blue-800 font-medium text-sm ">{userDatas.level}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
                      <CircleDollarSign size={16} className="text-indigo-600" />
                      <span className="text-indigo-800 font-medium text-sm"> {userDatas.point.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 오늘의 챌린지 */}
          <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-blue-600" />
                오늘의 챌린지
                <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {userDatas.dailyStreak}일째
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">

                {userDatas.todayTasks.map(task => (
                  <button
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center">
                        {task.completed && (
                          <div className="w-3 h-3 rounded-full bg-blue-400"/>
                        )}
                        <Dialog key={task.id-1}>
                        
                          <DialogTrigger asChild onClick={()=>{openChallenge()}}>
                            <p variant="outline">ㅤ</p>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader> 
                              <DialogTitle>Study Challenge</DialogTitle> 
                              <DialogDescription>AI 기반 맞춤형 학습 관리 플랫폼</DialogDescription>

                            </DialogHeader>

 
                             <div>
                               <label htmlFor={`imageUpload-${task.id-1}`} className="block text-sm font-medium text-gray-700 mb-2">
                                 오늘 공부할 페이지 이미지 업로드
                               </label>
                               <div className="flex items-center justify-center w-full">
                                 <label
                                   htmlFor={`imageUpload-${task.id-1}`}
                                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                 >
                                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                     <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                     <p className="mb-2 text-sm text-gray-500">
                                       <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                                     </p>
                                     <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                                   </div>
                                   <input
                                     type="file"
                                     id={`imageUpload-${task.id-1}`}
                                     accept="image/*"
                                     className="hidden"
                                     onChange={(e) => handleImageUpload(task.id-1, e)}
                                     multiple
                                   />

                                 </label>

                               </div>

                               {imageA && (
                                    <div className="mt-6">
                                      <h2 className="text-lg font-semibold text-gray-800 mb-4">공부하기전 이미지</h2>
                                      <div className="grid grid-cols-2 gap-2">
                                          <Image
                                            key={task.id-1}
                                            src={imageBase64 || "/placeholder.svg"}
                                            alt={`공부 페이지 ${task.id}`}
                                            width={200}
                                            height={150}
                                            className="rounded-lg w-full h-auto object-cover"
                                          />
      
      
                                      </div>
      
                                    </div>
                                  )}
                                <br/>
                               <div>
                                <label htmlFor={`imageUpload-${task.id-1}`} className="block text-sm font-medium text-gray-700 mb-2">
                                    완료된 공부 페이지를 업로드 해주세요
                                  </label>
                                  <div className="flex items-center justify-center w-full">
                                    <label
                                      htmlFor={`imageUpload-${task.id-1}/2`}
                                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                          <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 10MB)</p>
                                      </div>
                                      <input
                                        type="file"
                                        id={`imageUpload-${task.id-1}/2`}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUploadA(task.id-1, e)}
                                        multiple
                                      />
                                    </label>
                                  </div>




                                </div>
                                {imageB && (
                                    <div className="mt-6">
                                      <h2 className="text-lg font-semibold text-gray-800 mb-4">공부완료한후 이미지</h2>
                                      <div className="grid grid-cols-2 gap-2">
                                          <Image
                                            key={task.id-1}
                                            src={imageBase642 || "/placeholder.svg"}
                                            alt={`공부 페이지 ${task.id}`}
                                            width={200}
                                            height={150}
                                            className="rounded-lg w-full h-auto object-cover"
                                          />
                                      </div>
      
                                    </div>
                                  )}
                             </div>


                          </DialogContent>
                        </Dialog>
                      </div>
                      <span className={task.completed ? "line-through text-gray-500" : "font-medium"}>
                      <Dialog key={task.id-1}>
                        <DialogTrigger asChild>

                          <p variant="outline">{truncateText(task.title)}</p>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader> 
                            <DialogTitle>Study Challenge</DialogTitle> 
                            <DialogDescription>AI 기반 맞춤형 학습 관리 플랫폼</DialogDescription>
                            <div className='flex'>
                              <Image src={이미지} width={250} height={250} alt = "시계 이미지" className="mx-auto"/>
                              
                            </div>
                            <p>공부하기전 이미지와 공부한후 이미지를 촬영후 챌린지 옆 동그라미를 눌러 완료해주세요.</p>
                            <br/>
                            <Button onClick={()=>{StartChallenge(task.id-1)}} disabled={userDatas.todayTasks[task.id-1].challenging} variant="secondary" className="bg-blue-600 hover:bg-blue-600 text-white font-medium">챌린지 시작!!</Button>
                       
                          </DialogHeader>

                        </DialogContent>
                      </Dialog>
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">+{task.points}p</span>
                  </button>
                ))}

              </div>
            </CardContent>
          </Card>

          {/* 주간 학습 통계 */}
          <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChart2 className="text-blue-600" />
                주간 학습 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between ">
                {userDatas.weeklyProgress.map(day => (
                  <div key={day.day} className="flex flex-col items-center gap-2">
                    <div
                      className="w-6 bg-gradient-to-t from-blue-400 to-indigo-400 rounded-xl"
                      style={{
                        height: `${(day.minutes / 400) * 100}%`,
                        minHeight: day.minutes ? `${day.minutes/2}px` : '0'
                      }}
                    />
                    <span className="text-sm font-medium text-gray-600">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>



          {/* 학습 팁 */}
          <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">오늘의 학습 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="font-bold text-lg mb-2 text-blue-800">효율적인 암기법 🧠</h3>
                <p className="text-gray-700 leading-relaxed">
                  새로운 정보를 배울 때 기존 지식과 연결지어 생각하면 장기 기억으로
                  저장되기 쉽습니다. 오늘의 학습에서 시도해보세요!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
};