"use client";

import { useMemo, useState } from "react";
import { useTransactions, useDeleteTransaction } from "@/hooks/useTransactions";
import { Transaction, TransactionType } from "@/types/transaction";
import CategoryBadge from "@/components/common/CategoryBadge";
import TransactionEditModal from "@/components/transaction/TransactionEditModal";

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);
  const deleteTransaction = useDeleteTransaction();

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

  const handleDelete = async (transactionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("정말 이 거래를 삭제하시겠습니까?")) {
      setDeletingTransactionId(transactionId);
      try {
        await deleteTransaction.mutateAsync(transactionId);
      } catch (error) {
        alert("거래 삭제 중 오류가 발생했습니다.");
      } finally {
        setDeletingTransactionId(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b sticky top-0 bg-white rounded-t-lg">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">거래 내역</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl leading-none w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-gray-100 flex-shrink-0 ml-2"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">수입</p>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600 break-words">
                +{totals.income.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">지출</p>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-red-600 break-words">
                -{totals.expense.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">합계</p>
              <p
                className={`text-sm sm:text-base md:text-lg font-semibold break-words ${
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
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-sm sm:text-base text-gray-500">로딩 중...</div>
            </div>
          ) : dayTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4">📝</div>
              <p className="text-sm sm:text-base text-gray-500 text-center px-4">이 날짜에 등록된 거래 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {dayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative"
                  onClick={() => setEditingTransaction(transaction)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                    <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                        <span
                          className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
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
                          <CategoryBadge
                            name={transaction.category.name}
                            color={transaction.category.color}
                            size="md"
                          />
                        )}
                      </div>
                      <h4 className="font-medium text-sm sm:text-base text-gray-900 mb-1 break-words">
                        {transaction.description}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        {transaction.account && (
                          <span className="break-words">결제: {transaction.account.name}</span>
                        )}
                        {transaction.notes && (
                          <span className="text-gray-400 break-words">• {transaction.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-left sm:text-right sm:ml-4 flex-shrink-0">
                        <p
                          className={`text-base sm:text-lg font-semibold ${
                            transaction.transactionType === TransactionType.INCOME
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.transactionType === TransactionType.INCOME ? "+" : "-"}
                          {transaction.amount.toLocaleString()}원
                        </p>
                      </div>
                      {transaction.id && (
                        <button
                          onClick={(e) => handleDelete(transaction.id!, e)}
                          disabled={deletingTransactionId === transaction.id}
                          className="opacity-0 group-hover:opacity-100 sm:opacity-100 flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="삭제"
                        >
                          {deletingTransactionId === transaction.id ? (
                            <svg
                              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}
