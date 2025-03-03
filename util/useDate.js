/* eslint-disable    */

import { useEffect, useState } from "react";
import fireStore from "@/firebase/firestore"
import { collection, getDocs, query, where, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'

export default function useWeeklyProgress() {

  };
// 📌 주차 계산 함수 (ISO 8601 기준)

