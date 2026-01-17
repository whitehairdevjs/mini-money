"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CalendarView from "@/components/transaction/CalendarView";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // 클라이언트 사이드에서 토큰 확인 (초기 렌더링 시)
  const [hasToken, setHasToken] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  useEffect(() => {
    // 토큰이 없으면 즉시 리다이렉트
    const token = localStorage.getItem("token");
    if (!token) {
      setHasToken(false);
      router.replace("/login");
      return;
    }
    setHasToken(true);
  }, [router]);

  useEffect(() => {
    // AuthContext가 로딩 완료되고 인증되지 않은 경우
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 토큰이 없거나 로딩 중이거나 인증되지 않은 경우
  if (!hasToken || isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <div className="text-gray-600 font-medium">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">가계부</h1>
        </div>

        {/* 달력 뷰 */}
        <CalendarView />
      </div>
    </div>
  );
}

