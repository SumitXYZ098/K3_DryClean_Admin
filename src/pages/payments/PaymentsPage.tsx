import type React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import usePayments from "../../hooks/usePayments";
import useHeaderStore from "../../store/useHeaderStore";
import type { PaymentTransaction } from "../../types/payment";

import PaymentStatsHeader from "../../components/payments/PaymentStatsHeader";
import PaymentFilterBar from "../../components/payments/PaymentFilterBar";
import PaymentTable from "../../components/payments/PaymentTable";
import PaymentDetailSlideOver from "../../components/payments/PaymentDetailSlideOver";

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useHeaderStore();

  const {
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
    exportPaymentsCSV,
    stats,
  } = usePayments();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = payment.id.toLowerCase().includes(query);
        const matchesOrder = payment.orderId.toLowerCase().includes(query);
        const matchesCustomer = payment.customerName
          .toLowerCase()
          .includes(query);
        const matchesTxn = payment.transactionId.toLowerCase().includes(query);
        const matchesMethod = payment.method.toLowerCase().includes(query);
        const matchesStatus = payment.status.toLowerCase().includes(query);

        if (
          !matchesId &&
          !matchesOrder &&
          !matchesCustomer &&
          !matchesTxn &&
          !matchesMethod &&
          !matchesStatus
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "All" && payment.status !== statusFilter) {
        return false;
      }

      // 3. Payment Method Filter
      if (methodFilter !== "All Methods" && payment.method !== methodFilter) {
        return false;
      }

      // 4. Date Filter based on payment.createdAt / payment.date
      if (dateFilter && dateFilter !== "All Dates") {
        const rawDate = payment.createdAt;
        if (!rawDate) return false;

        const pDate = dayjs(rawDate);
        if (!pDate.isValid()) return false;

        const now = dayjs();
        if (dateFilter === "Today") {
          if (!pDate.isSame(now, "day")) return false;
        } else if (dateFilter === "Yesterday") {
          if (!pDate.isSame(now.subtract(1, "day"), "day")) return false;
        } else if (dateFilter === "Last 7 Days") {
          if (pDate.isBefore(now.subtract(7, "day").startOf("day")))
            return false;
        } else if (dateFilter === "Last 30 Days") {
          if (pDate.isBefore(now.subtract(30, "day").startOf("day")))
            return false;
        } else if (dateFilter === "This Month") {
          if (!pDate.isSame(now, "month")) return false;
        }
      }

      return true;
    });
  }, [payments, searchQuery, statusFilter, methodFilter, dateFilter]);

  // Pagination Logic
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage),
  );

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage]);

  const handleClearFilters = () => {
    setStatusFilter("All");
    setMethodFilter("All Methods");
    setDateFilter("All Dates");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const isFiltered =
    statusFilter !== "All" ||
    methodFilter !== "All Methods" ||
    dateFilter !== "All Dates" ||
    Boolean(searchQuery.trim());

  const handleViewOrder = (orderId: string) => {
    if (orderId && orderId !== "N/A") {
      setSearchQuery(orderId);
      navigate(`/orders?search=${encodeURIComponent(orderId)}`);
    } else {
      navigate("/orders");
    }
  };

  return (
    <div className="space-y-lg animate-fade-in relative pb-16">
      {/* Header & Metric Cards */}
      <PaymentStatsHeader
        stats={stats}
        onExportCSV={() => exportPaymentsCSV(filteredPayments)}
      />

      {/* Filter Bar */}
      <PaymentFilterBar
        statusFilter={statusFilter}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setCurrentPage(1);
        }}
        methodFilter={methodFilter}
        onMethodChange={(method) => {
          setMethodFilter(method);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onDateChange={(range) => {
          setDateFilter(range);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        isFiltered={isFiltered}
      />

      {/* Main Data Table */}
      <PaymentTable
        payments={paginatedPayments}
        isLoading={isLoading}
        totalCount={filteredPayments.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSelectPayment={(payment: PaymentTransaction) =>
          setSelectedPayment(payment)
        }
        onRefundPayment={refundPayment}
        onViewOrder={handleViewOrder}
      />

      {/* Payment Details Drawer / Slide-Over Panel */}
      <PaymentDetailSlideOver
        payment={selectedPayment}
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        onRefund={refundPayment}
        onViewOrder={handleViewOrder}
      />
    </div>
  );
};

export default PaymentsPage;
