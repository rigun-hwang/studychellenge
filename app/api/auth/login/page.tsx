'use client'

import React from 'react';
import { signIn } from 'next-auth/react';


export default function LoginPage() {
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-4">Sign in with Google</h1>
        <p className="text-center text-gray-600 mb-6">
          Elevate your online presence. Login to start generating your professional AI headshots in minutes.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000/' })}
          className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.15 0 5.9 1.14 8.1 3.02l6.06-6.06C34.36 3.35 29.48 1.5 24 1.5 14.91 1.5 7.2 6.83 3.9 14.1l7.03 5.47C12.76 12.26 18.08 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24c0-2.5-.43-4.92-1.22-7.19H24v10.69h12.78C35.06 31.23 30.17 34 24 34c-5.9 0-10.9-3.46-13.22-8.5L3.75 31.5C7.03 38.66 14.57 43.5 24 43.5 35.22 43.5 46.5 34.47 46.5 24z"
            />
            <path
              fill="#4A90E2"
              d="M10.78 25.5c-.43-1.28-.68-2.65-.68-4s.25-2.72.68-4.01L3.75 10.5C2.3 14.01 1.5 18 1.5 22s.8 7.99 2.25 11.5l7.03-5.5z"
            />
            <path
              fill="#FBBC05"
              d="M24 1.5c-3.49 0-6.79.98-9.66 2.7l7.03 5.47C22.72 8.56 23.34 8.5 24 8.5s1.28.06 1.9.17l7.03-5.47C30.8 2.48 27.5 1.5 24 1.5z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
