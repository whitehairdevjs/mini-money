"use client";

import { useState } from "react";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { TransactionType } from "@/types/transaction";

interface ExpenseFormProps {
  onSuccess?: () => void;
  defaultDate?: string;
}

export default function ExpenseForm({ onSuccess, defaultDate }: ExpenseFormProps) {
  const [transactionDate, setTransactionDate] = useState(
    defaultDate || new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [notes, setNotes] = useState("");
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.EXPENSE
  );

  const { mutateAsync, isPending } = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return alert("계정 ID를 입력해주세요.");
    if (!amount) return alert("금액을 입력해주세요.");
    if (!description) return alert("내역을 입력해주세요.");

    await mutateAsync({
      transactionDate,
      description,
      amount: Number(amount),
      transactionType,
      account: { id: Number(accountId) },
      category: categoryId ? { id: Number(categoryId) } : null,
      notes: notes || null,
    } as any);

    setDescription("");
    setAmount("");
    setCategoryId("");
    setNotes("");
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          수입/지출 입력
        </h2>
        <span className="text-xs text-gray-500">필수: 계정 ID, 금액, 내역</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-gray-700">유형</span>
          <select
            value={transactionType}
            onChange={(e) =>
              setTransactionType(e.target.value as TransactionType)
            }
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={TransactionType.INCOME}>수입</option>
            <option value={TransactionType.EXPENSE}>지출</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">날짜</span>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">계정 ID</span>
          <input
            type="number"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="예: 1"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">카테고리 ID (선택)</span>
          <input
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="예: 2"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">금액</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 15000"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="md:col-span-2 space-y-1">
          <span className="text-sm text-gray-700">내역</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 점심 식사"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="md:col-span-2 space-y-1">
          <span className="text-sm text-gray-700">메모 (선택)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="메모를 입력하세요"
            rows={3}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "저장 중..." : "저장"}
      </button>
    </form>
  );
}

