"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useCategories } from "@/hooks/useCategories";
import { TransactionType, Transaction } from "@/types/transaction";

interface ExpenseFormProps {
  onSuccess?: () => void;
  defaultDate?: string;
  initialTransaction?: Transaction | null;
}

export default function ExpenseForm({ onSuccess, defaultDate, initialTransaction }: ExpenseFormProps) {
  const isEditMode = !!initialTransaction?.id;
  
  const [transactionDate, setTransactionDate] = useState(
    initialTransaction?.transactionDate 
      ? new Date(initialTransaction.transactionDate).toISOString().slice(0, 10)
      : defaultDate || new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState(initialTransaction?.description || "");
  const [amount, setAmount] = useState(initialTransaction?.amount?.toString() || "");
  const [categoryId, setCategoryId] = useState(
    initialTransaction?.category?.id?.toString() || ""
  );
  const [accountId, setAccountId] = useState(
    initialTransaction?.account?.id?.toString() || ""
  );
  const [notes, setNotes] = useState(initialTransaction?.notes || "");
  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialTransaction?.transactionType || TransactionType.EXPENSE
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCategoryId(id);
    setIsCategoryDropdownOpen(false);
  }, []);

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();
  const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateTransaction();
  const isPending = isCreating || isUpdating;
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

  const selectedCategory = useMemo(
    () => categories.find((cat) => String(cat.id) === categoryId),
    [categories, categoryId]
  );

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

  // 카드 계정을 기본값으로 설정 (수정 모드가 아니고 계정이 선택되지 않은 경우만)
  useEffect(() => {
    if (!isEditMode && !accountId && cardAccount) {
      setAccountId(String(cardAccount.id));
    }
  }, [cardAccount, accountId, isEditMode]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!isCategoryDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };

    // 약간의 지연을 두어 현재 클릭 이벤트가 처리된 후에 리스너 추가
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [isCategoryDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return alert("결제 수단을 선택해주세요.");
    if (!amount) return alert("금액을 입력해주세요.");
    if (!description) return alert("내역을 입력해주세요.");

    const transactionData = {
      transactionDate,
      description,
      amount: Number(amount),
      transactionType,
      account: { id: Number(accountId) },
      category: categoryId ? { id: Number(categoryId) } : null,
      notes: notes || null,
    };

    if (isEditMode && initialTransaction?.id) {
      await updateTransaction({
        id: initialTransaction.id,
        transaction: transactionData,
      });
    } else {
      await createTransaction(transactionData as any);
      // 생성 모드일 때만 폼 초기화
      setDescription("");
      setAmount("");
      setCategoryId("");
      setNotes("");
    }

    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          {isEditMode ? "거래 수정" : "수입/지출 입력"}
        </h2>
        <span className="text-xs text-gray-500">필수: 결제, 금액, 내역</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <label className="space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">유형</span>
          <select
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value as TransactionType);
              // 거래 유형 변경 시 카테고리 초기화 (새 유형에 맞지 않을 수 있음)
              setCategoryId("");
            }}
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={TransactionType.INCOME}>수입</option>
            <option value={TransactionType.EXPENSE}>지출</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">날짜</span>
          <input
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">결제</span>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <span className="text-xs sm:text-sm text-gray-700">카테고리 (선택)</span>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={categoriesLoading}
            >
              <span className="flex items-center gap-2 min-w-0 flex-1">
                {selectedCategory ? (
                  <>
                    {selectedCategory.color && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/5 flex-shrink-0"
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                    )}
                    <span className="truncate">{selectedCategory.name}</span>
                  </>
                ) : (
                  <span className="text-gray-500">카테고리를 선택하세요 (선택사항)</span>
                )}
              </span>
              <span className="ml-2 text-gray-400 flex-shrink-0">
                {isCategoryDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {isCategoryDropdownOpen && (
              <div 
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => handleSelectCategory("", e)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${
                    !categoryId ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="text-gray-500">카테고리 없음</span>
                </button>
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={(e) => handleSelectCategory(String(category.id), e)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${
                      categoryId === String(category.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    {category.color && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/5 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {categoriesLoading && (
            <p className="text-xs text-gray-500">카테고리 목록을 불러오는 중...</p>
          )}
        </label>

        <label className="space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">금액</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 15000"
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="md:col-span-2 space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">내역</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 점심 식사"
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        <label className="md:col-span-2 space-y-1">
          <span className="text-xs sm:text-sm text-gray-700">메모 (선택)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="메모를 입력하세요"
            rows={3}
            className="w-full border rounded px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? (isEditMode ? "수정 중..." : "저장 중...") : (isEditMode ? "수정" : "저장")}
      </button>
    </form>
  );
}

