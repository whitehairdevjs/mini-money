"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction, TransactionType } from "@/types/transaction";
import TransactionModal from "@/components/TransactionModal";

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data: transactions = [], isLoading } = useTransactions();

  const [year, month] = useMemo(() => {
    const [y, m] = currentMonth.split("-").map(Number);
    return [y, m - 1]; // month is 0-indexed
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      
      const dayTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.transactionDate);
        const transactionDateStr = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}-${String(transactionDate.getDate()).padStart(2, "0")}`;
        return transactionDateStr === dateStr;
      });

      const totalIncome = dayTransactions
        .filter((t) => t.transactionType === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = dayTransactions
        .filter((t) => t.transactionType === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);

      days.push({
        date: dateOnly,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateOnly.getTime() === today.getTime(),
        transactions: dayTransactions,
        totalIncome,
        totalExpense,
      });
    }

    return days;
  }, [year, month, transactions]);

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    setCurrentMonth(`${prevYear}-${String(prevMonth).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split("-").map(Number);
    const nextMonth = m === 12 ? 1 : m + 1;
    const nextYear = m === 12 ? y + 1 : y;
    setCurrentMonth(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

      if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-sm sm:text-base md:text-lg text-gray-500">로딩 중...</div>
          </div>
        );
      }

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
      {/* 헤더: 월 선택 */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={handlePrevMonth}
          className="px-2 py-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="이전 달"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="month"
            value={currentMonth}
            onChange={handleMonthChange}
            className="text-base sm:text-lg md:text-xl font-bold text-gray-900 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-auto"
          />
        </div>

        <button
          onClick={handleNextMonth}
          className="px-2 py-2 sm:px-3 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="다음 달"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {calendarDays.map((day, index) => {
          const dateStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`;
          
          return (
            <TransactionModal
              key={`${dateStr}-${index}`}
              defaultDate={dateStr}
            >
              {({ openModal }) => (
                <div
                  onClick={openModal}
                  className={`
                    min-h-[60px] sm:min-h-[80px] md:min-h-[100px] p-1 sm:p-1.5 md:p-2 rounded border-2 cursor-pointer transition-all
                    ${day.isCurrentMonth ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-50"}
                    ${day.isToday ? "border-blue-500 ring-1 sm:ring-2 ring-blue-200" : ""}
                    hover:bg-blue-50 hover:border-blue-300
                  `}
                >
                  <div
                    className={`
                      text-xs sm:text-sm font-medium mb-0.5 sm:mb-1
                      ${day.isToday ? "text-blue-600" : day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    `}
                  >
                    {day.day}
                  </div>
                  
                  {day.isCurrentMonth && (
                    <div className="space-y-0.5 sm:space-y-1">
                      {day.totalIncome > 0 && (
                        <div className="text-[10px] sm:text-xs text-green-600 font-medium truncate">
                          +{day.totalIncome.toLocaleString()}원
                        </div>
                      )}
                      {day.totalExpense > 0 && (
                        <div className="text-[10px] sm:text-xs text-red-600 font-medium truncate">
                          -{day.totalExpense.toLocaleString()}원
                        </div>
                      )}
                      {day.transactions.length > 0 && (
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          {day.transactions.length}건
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </TransactionModal>
          );
        })}
      </div>
    </div>
  );
}

