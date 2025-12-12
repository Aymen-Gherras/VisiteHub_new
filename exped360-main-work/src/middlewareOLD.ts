// Old middleware file - kept for reference
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Legacy middleware logic
  return NextResponse.next()
} 