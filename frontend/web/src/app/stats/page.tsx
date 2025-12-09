"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/transaction";
import { useMemo } from "react";

export default function StatsPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  const summary = useMemo(() => {
    if (!transactions) {
      return { income: 0, expense: 0, balance: 0 };
    }

    const income = transactions
      .filter((t) => t.transactionType === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.transactionType === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      )
      .slice(0, 10);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm sm:text-base md:text-lg text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-sm sm:text-base md:text-lg text-red-600 text-center">
          통계 데이터를 불러오는 중 오류가 발생했습니다: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">통계</h1>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">총 수입</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 break-words">
              {formatCurrency(summary.income)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">총 지출</div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 break-words">
              {formatCurrency(summary.expense)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">잔액</div>
            <div
              className={`text-lg sm:text-xl md:text-2xl font-bold break-words ${
                summary.balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatCurrency(summary.balance)}
            </div>
          </div>
        </div>

        {/* 최근 거래 내역 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
              최근 거래 내역 (최신 10건)
            </h2>
          </div>
          <div className="overflow-x-auto">
            {recentTransactions.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 sm:py-12 text-center text-sm sm:text-base text-gray-500">
                거래 내역이 없습니다.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      내역
                    </th>
                    <th className="hidden sm:table-cell px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {formatDate(transaction.transactionDate)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 break-words">
                        {transaction.description}
                        {transaction.category && (
                          <span className="sm:hidden block text-xs text-gray-500 mt-1">
                            {transaction.category.name}
                          </span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {transaction.category?.name || "-"}
                      </td>
                      <td
                        className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-right font-medium ${
                          transaction.transactionType === TransactionType.INCOME
                            ? "text-green-600"
                            : transaction.transactionType ===
                              TransactionType.EXPENSE
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {transaction.transactionType === TransactionType.INCOME
                          ? "+"
                          : transaction.transactionType ===
                            TransactionType.EXPENSE
                          ? "-"
                          : ""}
                        {formatCurrency(Number(transaction.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

