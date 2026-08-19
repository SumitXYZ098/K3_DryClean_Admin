import { create } from "zustand";
import type {
  PaymentTransaction,
  PaymentStatus,
  PaymentStats,
} from "../types/payment";
import dayjs from "dayjs";

interface PaymentState {
  payments: PaymentTransaction[];
  isLoading: boolean;
  selectedPayment: PaymentTransaction | null;
  statusFilter: string;
  methodFilter: string;
  dateFilter: string;

  // Actions
  setPayments: (payments: PaymentTransaction[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSelectedPayment: (payment: PaymentTransaction | null) => void;
  setStatusFilter: (status: string) => void;
  setMethodFilter: (method: string) => void;
  setDateFilter: (dateFilter: string) => void;
  refundPayment: (paymentId: string) => void;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus) => void;
  getStats: () => PaymentStats;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  isLoading: true,
  selectedPayment: null,
  statusFilter: "All",
  methodFilter: "All Methods",
  dateFilter: "All Dates",

  setPayments: (payments) => set({ payments, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedPayment: (selectedPayment) => set({ selectedPayment }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setMethodFilter: (methodFilter) => set({ methodFilter }),
  setDateFilter: (dateFilter) => set({ dateFilter }),

  refundPayment: (paymentId) =>
    set((state) => {
      const updated = state.payments.map((p) =>
        p.id === paymentId || p.documentId === paymentId
          ? { ...p, status: "Refunded" as PaymentStatus }
          : p,
      );
      const updatedSelected =
        state.selectedPayment?.id === paymentId ||
        state.selectedPayment?.documentId === paymentId
          ? { ...state.selectedPayment, status: "Refunded" as PaymentStatus }
          : state.selectedPayment;
      return { payments: updated, selectedPayment: updatedSelected };
    }),

  updatePaymentStatus: (paymentId, status) =>
    set((state) => {
      const updated = state.payments.map((p) =>
        p.id === paymentId || p.documentId === paymentId ? { ...p, status } : p,
      );
      const updatedSelected =
        state.selectedPayment?.id === paymentId ||
        state.selectedPayment?.documentId === paymentId
          ? { ...state.selectedPayment, status }
          : state.selectedPayment;
      return { payments: updated, selectedPayment: updatedSelected };
    }),

  getStats: () => {
    const { payments } = get();
    const todayStr = dayjs().format("YYYY-MM-DD");

    const paidPayments = payments.filter((p) => p.status === "Paid");
    const totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    const todayPaidPayments = paidPayments.filter((p) => {
      if (!p.createdAt && !p.date) return false;
      const dateVal = p.createdAt || p.date;
      return dayjs(dateVal).format("YYYY-MM-DD") === todayStr;
    });

    const todayRevenue =
      todayPaidPayments.length > 0
        ? todayPaidPayments.reduce((sum, p) => sum + p.amount, 0)
        : totalPaidAmount;

    return {
      todayRevenue,
      totalTransactions: payments.length,
      paidCount: payments.filter((p) => p.status === "Paid").length,
      pendingCount: payments.filter((p) => p.status === "Pending").length,
      failedCount: payments.filter((p) => p.status === "Failed").length,
      refundedCount: payments.filter((p) => p.status === "Refunded").length,
      totalPaidAmount,
    };
  },
}));

export default usePaymentStore;
