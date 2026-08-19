export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export type PaymentMethod =
  | "Online (UPI)"
  | "Credit Card"
  | "Cash"
  | "Cash (COD)"
  | "Debit Card"
  | "Net Banking"
  | "Online";

export interface OrderItemSummary {
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentTransaction {
  documentId?: string; // Strapi documentId
  id: string; // e.g. PAY-XDQTO4 or PAY-10025
  orderId: string; // e.g. ORD26-0BDF82 or K3-10025
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  amount: number;
  method: PaymentMethod | string;
  status: PaymentStatus;
  date: string; // Formatted date string, e.g. "18 Aug 2026, 14:30"
  transactionId: string; // e.g. TXN123456789 or PAY-XDQTO4
  createdAt?: string; // ISO date string
  notes?: string;
  items: OrderItemSummary[];
}

export interface PaymentStats {
  todayRevenue: number;
  totalTransactions: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  totalPaidAmount: number;
}

export interface RawPaymentLogResponse {
  documentId: string;
  paymentId: string | null;
  transactionId: string | null;
  amount: number;
  payment_status: string;
  paymentDate: string | null;
  createdAt: string;
  order: {
    orderNo: string;
    paymentMethod: string;
  } | null;
  orderItems: Array<{
    quantity: number;
    totalPrice: number;
    service?: {
      name?: string;
    };
    service_varient?: {
      name?: string;
    };
  }>;
  customer: {
    documentId: string;
    fullName: string;
    phoneNumber: string;
  } | null;
}
