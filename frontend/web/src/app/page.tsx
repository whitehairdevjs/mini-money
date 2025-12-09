"use client";

import { useMemo } from "react";
import TransactionModal from "@/components/TransactionModal";

export default function Home() {
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const monthDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        label: `${day}일`,
        date: formatDate(year, month, day),
      };
    });
  }, [month, year]);

  const monthLabel = useMemo(
    () => `${year}년 ${String(month + 1).padStart(2, "0")}월`,
    [month, year]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">가계부</h1>
        </div>

        {/* 현재 월 날짜 리스트 + 모달 트리거 */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {monthLabel} 날짜 선택 후 입력
              </h2>
              <p className="text-sm text-gray-500">
                날짜를 눌러 수입/지출을 입력하세요.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {monthDays.map(({ label, date }) => (
              <TransactionModal
                key={date}
                defaultDate={date}
                triggerLabel={`${label} 입력`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

