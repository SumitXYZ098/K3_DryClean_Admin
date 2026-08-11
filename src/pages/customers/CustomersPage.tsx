/* eslint-disable react-hooks/set-state-in-effect */
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import useSnackbarStore from "../../store/useSnackbarStore";
import useLoadingStore from "../../store/useLoadingStore";
import useHeaderStore from "../../store/useHeaderStore";
import useCustomerHook from "../../hooks/useCustomerHook";
import type { Customer } from "../../store/useCustomerStore";
export type { Customer };
import CustomerFilterBar from "../../components/customers/CustomerFilterBar";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerDetailModal from "../../components/customers/CustomerDetailModal";

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { searchQuery, setSearchQuery, setCustomActionHandler } =
    useHeaderStore();

  const { customers, fetchCustomers, toggleCustomerStatus, deleteCustomer } =
    useCustomerHook();

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [spendFilter, setSpendFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const [selectedCustomerDetail, setSelectedCustomerDetail] =
    useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch customer profiles from API on component mount
  useEffect(() => {
    fetchCustomers().catch(() => {
      // Handled silently or via interceptor/hook error state
    });
  }, [fetchCustomers]);

  // Register custom action handler for TopNavigationBar primary button on this page
  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/customers/add");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  // Filtered customers logic
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return customers.filter((customer) => {
      // Header Search filter
      if (query) {
        const matchName = customer.name?.toLowerCase().includes(query);
        const matchEmail = customer.email?.toLowerCase().includes(query);
        const matchPhone = customer.phone?.toLowerCase().includes(query);
        const matchId = customer.id?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchPhone && !matchId) {
          return false;
        }
      }

      // Spend filter
      if (spendFilter === "High Value") {
        if (customer.totalSpend <= 500) return false;
      } else if (spendFilter === "Mid Range") {
        if (customer.totalSpend < 100 || customer.totalSpend > 500)
          return false;
      } else if (spendFilter === "New Customers") {
        if (customer.totalSpend >= 100) return false;
      }

      // Status filter
      if (statusFilter !== "All" && customer.status !== statusFilter) {
        return false;
      }

      // Date filter check
      if (dateFilter === "Inactive (>90 Days)") {
        if (
          customer.status === "Active" &&
          !customer.lastOrder.includes("Aug")
        ) {
          return false;
        }
      }

      return true;
    });
  }, [customers, searchQuery, spendFilter, dateFilter, statusFilter]);

  // Reset page to 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, spendFilter, dateFilter, statusFilter]);

  // Pagination calculation
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / itemsPerPage),
  );

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSpendFilter("All");
    setDateFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
    showSnackbar({
      message: "All directory filters cleared",
      type: "info",
    });
  };

  const handleExportCSV = () => {
    showLoading("Generating Customer Directory CSV...");
    setTimeout(() => {
      hideLoading();
      const headers =
        "Customer ID,Name,Email,Phone,Orders,Balance,Status,Last Order\n";
      const rows = filteredCustomers
        .map(
          (c) =>
            `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.totalSpend},"${c.status}","${c.lastOrder}"`,
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `k3_customers_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showSnackbar({
        message: "Customer directory exported successfully!",
        type: "success",
      });
    }, 800);
  };

  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === "Active" ? "Suspended" : "Active";
    toggleCustomerStatus(customer.id);
    setOpenActionMenuId(null);
    showSnackbar({
      message: `Customer ${customer.name} status updated to ${newStatus}`,
      type: newStatus === "Active" ? "success" : "warning",
    });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    deleteCustomer(customer.id);
    setOpenActionMenuId(null);
    showSnackbar({
      message: `Customer ${customer.name} removed from directory`,
      type: "info",
    });
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Customer Directory
          </h2>
          <p className="text-body-lg text-secondary">
            Manage and track your client database with precision.
          </p>
        </div>

        <div className="flex items-center gap-md">
          <div className="flex flex-col items-start gap-1 bg-surface-container-lowest px-md py-sm rounded-md shadow-xs">
            <span className="text-label-sm text-secondary uppercase font-bold tracking-wider">
              Total Customers
            </span>
            <span className="font-headline-md text-headline-md text-primary font-bold">
              {customers.length.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar Component */}
      <CustomerFilterBar
        spendFilter={spendFilter}
        onSpendFilterChange={setSpendFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
        onExportCSV={handleExportCSV}
      />

      {/* Customer Directory Table Component */}
      <CustomerTable
        customers={paginatedCustomers}
        totalCount={filteredCustomers.length}
        selectedRowId={selectedRowId}
        openActionMenuId={openActionMenuId}
        onSelectRow={setSelectedRowId}
        onToggleMenu={setOpenActionMenuId}
        onViewDetails={setSelectedCustomerDetail}
        onToggleStatus={handleToggleStatus}
        onDeleteCustomer={handleDeleteCustomer}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Customer Detail View Modal Component */}
      <CustomerDetailModal
        customer={selectedCustomerDetail}
        onClose={() => setSelectedCustomerDetail(null)}
      />
    </div>
  );
};

export default CustomersPage;
