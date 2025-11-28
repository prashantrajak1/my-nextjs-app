export interface Labor {
  id: string;
  name: string;
  address: string;
  due: number;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  note?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface Sale {
  id: string;
  date: string;
  vehicleNo: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  receivedAmount: number;
}

export interface DatabaseSchema {
  labors: Labor[];
  expenses: Expense[];
  sales: Sale[];
}
