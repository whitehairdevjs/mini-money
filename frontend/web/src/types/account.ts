export interface Account {
  id: number;
  name: string;
  accountType: "CASH" | "BANK" | "CARD" | "CREDIT_CARD" | "INVESTMENT" | "SAVINGS";
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

