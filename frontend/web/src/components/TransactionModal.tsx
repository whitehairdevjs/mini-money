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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">수입/지출 입력</h3>
              <div className="flex items-center gap-2">
                {defaultDate && (
                  <button
                    onClick={openListModal}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    리스트 확인
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">
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

