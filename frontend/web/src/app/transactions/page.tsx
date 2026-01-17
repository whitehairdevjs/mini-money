"use client";

import { useTransactions } from "@/hooks/useTransactions";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import ExpenseForm from "@/components/transaction/ExpenseForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm sm:text-base md:text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-sm sm:text-base md:text-lg text-red-600 text-center">
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Transactions</h1>
          </div>

          <ExpenseForm />

          <TransactionsTable data={transactions || []} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

