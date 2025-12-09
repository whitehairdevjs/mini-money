"use client";

import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction, TransactionType } from "@/types/transaction";

interface TransactionListModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionListModal({
  date,
  isOpen,
  onClose,
}: TransactionListModalProps) {
  const { data: allTransactions = [], isLoading } = useTransactions();

  // 해당 날짜의 거래 내역 필터링
  const dayTransactions = useMemo(() => {
    if (!date) return [];
    return allTransactions.filter((t) => {
      const transactionDate = new Date(t.transactionDate);
      const transactionDateStr = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}-${String(transactionDate.getDate()).padStart(2, "0")}`;
      return transactionDateStr === date;
    });
  }, [allTransactions, date]);

  // 날짜 포맷팅
  const formattedDate = useMemo(() => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  }, [date]);

  // 합계 계산
  const totals = useMemo(() => {
    const income = dayTransactions
      .filter((t) => t.transactionType === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter((t) => t.transactionType === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [dayTransactions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-lg">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">거래 내역</h3>
            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">수입</p>
              <p className="text-lg font-semibold text-green-600">
                +{totals.income.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">지출</p>
              <p className="text-lg font-semibold text-red-600">
                -{totals.expense.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">합계</p>
              <p
                className={`text-lg font-semibold ${
                  totals.net >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totals.net >= 0 ? "+" : ""}
                {totals.net.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          ) : dayTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-500">이 날짜에 등록된 거래 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.transactionType === TransactionType.INCOME
                              ? "bg-green-100 text-green-800"
                              : transaction.transactionType === TransactionType.EXPENSE
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.transactionType === TransactionType.INCOME
                            ? "수입"
                            : transaction.transactionType === TransactionType.EXPENSE
                            ? "지출"
                            : "이체"}
                        </span>
                        {transaction.category && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {transaction.category.name}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {transaction.account && (
                          <span>결제: {transaction.account.name}</span>
                        )}
                        {transaction.notes && (
                          <span className="text-gray-400">• {transaction.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.transactionType === TransactionType.INCOME
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType === TransactionType.INCOME ? "+" : "-"}
                        {transaction.amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

