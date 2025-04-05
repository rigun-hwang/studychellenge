// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 간단한 in-memory 제한 (Vercel에서 Redis 추천)
const rateLimitMap = new Map<string, number[]>()

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowTime = 60 * 1000 // 1분
  const maxRequests = 20

  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter(t => now - t < windowTime)

  recent.push(now)
  rateLimitMap.set(ip, recent)

  if (recent.length > maxRequests) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  return NextResponse.next()
}

// 설정할 경로 지정
export const config = {
  matcher: ['/', '/removeaccount', '/about', '/api/:path*'],
}
