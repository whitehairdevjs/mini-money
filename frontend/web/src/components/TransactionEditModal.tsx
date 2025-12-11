"use client";

import { Transaction } from "@/types/transaction";
import ExpenseForm from "@/components/ExpenseForm";

interface TransactionEditModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionEditModal({
  transaction,
  isOpen,
  onClose,
}: TransactionEditModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-4 overflow-y-auto">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b sticky top-0 bg-white rounded-t-lg">
          <h3 className="text-base sm:text-lg font-semibold">거래 수정</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl leading-none w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <ExpenseForm
            initialTransaction={transaction}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}

