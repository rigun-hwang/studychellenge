'use client'

import {useSession, signIn, signOut} from "next-auth/react"
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession(); //세션 정보를 가져옴


    return (
    <nav className="flex items-center justify-between px-6">
      <Link href="/">
        <h1 className="text-3xl font-bold">unigram</h1>
      </Link>

      <ul className="flex gap-4 items-center p-4">


        {session ? ( //세션 정보가 있으면 signOut()호출
            <button onClick={() => signOut()}>Sign out</button>
        ) : ( //세션 정보가 없으면 signIn()호출
            <button onClick={() => signIn()}>Sign in</button>
        )}
      </ul>
    </nav>
  );
}
