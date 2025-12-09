export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

export interface CategoryRef {
  id: number;
  name?: string;
}

export interface AccountRef {
  id: number;
  name?: string;
}

export interface Transaction {
  id?: number;
  transactionDate: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  category?: CategoryRef | null;
  account: AccountRef;
  targetAccount?: AccountRef | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

