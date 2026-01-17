import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 로그인 및 회원가입 페이지는 제외
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  // 정적 파일 및 API 라우트는 제외
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo")
  ) {
    return NextResponse.next();
  }

  // 토큰 확인
  const token = request.cookies.get("token")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "");

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    // 클라이언트 사이드에서 localStorage를 확인하도록 하기 위해
    // 여기서는 항상 통과시키고, 클라이언트에서 처리
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
