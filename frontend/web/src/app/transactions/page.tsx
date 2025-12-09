"use client";

import { useTransactions } from "@/hooks/useTransactions";
import TransactionsTable from "@/components/TransactionsTable";
import ExpenseForm from "@/components/ExpenseForm";

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <ExpenseForm />

      <TransactionsTable data={transactions || []} />
    </div>
  );
}

