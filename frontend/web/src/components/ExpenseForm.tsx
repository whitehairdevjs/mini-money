"use client";

import { useState, useMemo, useEffect } from "react";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
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
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // 거래 유형에 맞는 카테고리 필터링
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.transactionType === transactionType ||
        cat.transactionType === "BOTH"
    );
  }, [categories, transactionType]);

  // 활성 계정만 필터링하고 정렬 (카드가 제일 위에 오도록)
  const activeAccounts = useMemo(() => {
    const filtered = accounts.filter((acc) => acc.isActive);
    return filtered.sort((a, b) => {
      // 카드(CARD 또는 CREDIT_CARD)가 제일 위에 오도록
      const aIsCard = a.accountType === "CARD" || a.accountType === "CREDIT_CARD";
      const bIsCard = b.accountType === "CARD" || b.accountType === "CREDIT_CARD";
      if (aIsCard && !bIsCard) return -1;
      if (!aIsCard && bIsCard) return 1;
      // 같은 타입이면 이름순 정렬
      return a.name.localeCompare(b.name, "ko");
    });
  }, [accounts]);

  // 카드 계정 찾기 (기본값으로 사용)
  const cardAccount = useMemo(() => {
    return activeAccounts.find(
      (acc) => acc.accountType === "CARD" || acc.accountType === "CREDIT_CARD"
    );
  }, [activeAccounts]);

  // 카드 계정을 기본값으로 설정
  useEffect(() => {
    if (!accountId && cardAccount) {
      setAccountId(String(cardAccount.id));
    }
  }, [cardAccount, accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return alert("결제 수단을 선택해주세요.");
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
        <span className="text-xs text-gray-500">필수: 결제, 금액, 내역</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-gray-700">유형</span>
          <select
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value as TransactionType);
              // 거래 유형 변경 시 카테고리 초기화 (새 유형에 맞지 않을 수 있음)
              setCategoryId("");
            }}
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
          <span className="text-sm text-gray-700">결제</span>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={accountsLoading}
          >
            <option value="">결제 수단을 선택하세요</option>
            {activeAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.accountType}) - {account.balance.toLocaleString()}원
              </option>
            ))}
          </select>
          {accountsLoading && (
            <p className="text-xs text-gray-500">계정 목록을 불러오는 중...</p>
          )}
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">카테고리 (선택)</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={categoriesLoading}
          >
            <option value="">카테고리를 선택하세요 (선택사항)</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoriesLoading && (
            <p className="text-xs text-gray-500">카테고리 목록을 불러오는 중...</p>
          )}
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

