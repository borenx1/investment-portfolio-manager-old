export interface CapitalChange {
  account: string;
  date: string;
  asset: string;
  amount: number;
  notes: string;
  price: Record<string, number>;
}

export interface CapitalTransfer {
  fromAccount: string;
  toAccount: string;
  date: string;
  asset: string;
  amount: number;
  notes: string;
  price: Record<string, number>;
}