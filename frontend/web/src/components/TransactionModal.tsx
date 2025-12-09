"use client";

import { useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";

interface TransactionModalProps {
  triggerLabel: string;
  defaultDate?: string;
}

export default function TransactionModal({
  triggerLabel,
  defaultDate,
}: TransactionModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 rounded border hover:bg-gray-50 transition"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">수입/지출 입력</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <ExpenseForm
                defaultDate={defaultDate}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

