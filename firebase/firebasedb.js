// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA4wTjtDUjyDSAtTKUEWnnDuiMN8574nEk",
    authDomain: "studychallenge-f9db6.firebaseapp.com",
    projectId: "studychallenge-f9db6",
    storageBucket: "studychallenge-f9db6.firebasestorage.app",
    messagingSenderId: "875567130150",
    appId: "1:875567130150:web:c4574be64254b4621c28e7",
    measurementId: "G-XFEEF3JVKN"
};
//   apiKey: process.env.apiKey,
//   authDomain: process.env.authDomain,
//   projectId: process.env.projectId,
//   storageBucket: process.env.storageBucket,
//   messagingSenderId: process.env.messagingSenderId,
//   appId: process.env.appId,
//   measurementId: process.env.measurementId
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {app, auth}