import { useEffect, useCallback } from "react";
import usePaymentStore from "../store/usePaymentStore";
import paymentApi from "../api/paymentApi";
import useSnackbarStore from "../store/useSnackbarStore";
import useLoadingStore from "../store/useLoadingStore";
import type { PaymentTransaction, PaymentStatus } from "../types/payment";

export const usePayments = () => {
  const {
    payments,
    isLoading,
    selectedPayment,
    statusFilter,
    methodFilter,
    dateFilter,
    setPayments,
    setIsLoading,
    setSelectedPayment,
    setStatusFilter,
    setMethodFilter,
    setDateFilter,
    refundPayment: refundInStore,
    updatePaymentStatus: updateInStore,
    getStats,
  } = usePaymentStore();

  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();

  // Initial fetch from backend with skeleton state
  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await paymentApi.getAllPayments();
      setPayments(data || []);
    } catch (error) {
      console.warn("Failed to fetch payment transactions:", error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, [setPayments, setIsLoading]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const refundPayment = async (paymentId: string) => {
    const target = payments.find(
      (p) => p.id === paymentId || p.documentId === paymentId
    );
    const targetDocId = target?.documentId || paymentId;

    showLoading(`Processing refund for payment ${paymentId}...`);
    try {
      await paymentApi.refundPayment(targetDocId);
      refundInStore(paymentId);
      showSnackbar({
        message: `Refund successfully processed for ${paymentId}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      refundInStore(paymentId);
      showSnackbar({
        message: `Refund recorded for ${paymentId}`,
        type: "info",
      });
    } finally {
      hideLoading();
    }
  };

  const updateStatus = async (paymentId: string, status: PaymentStatus) => {
    updateInStore(paymentId, status);
    showSnackbar({
      message: `Payment ${paymentId} status updated to ${status}`,
      type: "info",
    });
  };

  const exportPaymentsCSV = (filteredList: PaymentTransaction[]) => {
    showLoading("Exporting payment transactions...");
    setTimeout(() => {
      hideLoading();
      const headers =
        "Payment ID,Order ID,Customer Name,Amount,Method,Status,Date,Transaction ID\n";
      const rows = filteredList
        .map(
          (p) =>
            `"${p.id}","${p.orderId}","${p.customerName}",${p.amount},"${p.method}","${p.status}","${p.date}","${p.transactionId}"`
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `k3_payments_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showSnackbar({
        message: `Exported ${filteredList.length} payment records to CSV`,
        type: "success",
      });
    }, 600);
  };

  return {
    payments,
    isLoading,
    selectedPayment,
    statusFilter,
    methodFilter,
    dateFilter,
    setSelectedPayment,
    setStatusFilter,
    setMethodFilter,
    setDateFilter,
    refundPayment,
    updateStatus,
    exportPaymentsCSV,
    stats: getStats(),
  };
};

export default usePayments;
