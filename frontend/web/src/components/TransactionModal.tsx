"use client";

import { useState, ReactNode } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import TransactionListModal from "@/components/TransactionListModal";

interface TransactionModalProps {
  triggerLabel?: string;
  defaultDate?: string;
  children?: (props: { openModal: () => void }) => ReactNode;
}

export default function TransactionModal({
  triggerLabel,
  defaultDate,
  children,
}: TransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const openListModal = () => setListModalOpen(true);
  const closeListModal = () => setListModalOpen(false);

  return (
    <>
      {children ? (
        children({ openModal })
      ) : (
        <button
          onClick={openModal}
          className="w-full text-left px-4 py-3 rounded border hover:bg-gray-50 transition"
        >
          {triggerLabel}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-4 overflow-y-auto">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base sm:text-lg font-semibold">수입/지출 입력</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                {defaultDate && (
                  <button
                    onClick={openListModal}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    리스트 확인
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl leading-none w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <ExpenseForm
                defaultDate={defaultDate}
                onSuccess={closeModal}
              />
            </div>
          </div>
        </div>
      )}

      <TransactionListModal
        date={defaultDate || ""}
        isOpen={listModalOpen}
        onClose={closeListModal}
      />
    </>
  );
}

