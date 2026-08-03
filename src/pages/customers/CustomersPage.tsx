import type React from "react";
import { useState, useMemo, useEffect } from "react";
import useSnackbarStore from "../../store/useSnackbarStore";
import useLoadingStore from "../../store/useLoadingStore";
import useHeaderStore from "../../store/useHeaderStore";
import CustomerFilterBar from "../../components/customers/CustomerFilterBar";
import CustomerTable from "../../components/customers/CustomerTable";
import AddCustomerModal, {
  type AddCustomerFormInputs,
} from "../../components/customers/AddCustomerModal";
import CustomerDetailModal from "../../components/customers/CustomerDetailModal";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  walletBalance: number;
  status: "Active" | "Suspended";
  lastOrder: string;
  avatarUrl?: string;
  initials?: string;
  initialsBg?: string;
}

const initialCustomers: Customer[] = [
  {
    id: "#K3-4902",
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    totalOrders: 42,
    walletBalance: 124.5,
    status: "Active",
    lastOrder: "Oct 24, 2023",
    initials: "SM",
    initialsBg: "bg-primary-fixed text-primary font-bold",
  },
  {
    id: "#K3-4811",
    name: "David Chen",
    email: "d.chen@techmail.io",
    phone: "(555) 987-6543",
    totalOrders: 15,
    walletBalance: 0.0,
    status: "Active",
    lastOrder: "Nov 02, 2023",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
  },
  {
    id: "#K3-3762",
    name: "Robert Lewis",
    email: "rlewis@provider.com",
    phone: "(555) 444-3322",
    totalOrders: 8,
    walletBalance: -12.4,
    status: "Suspended",
    lastOrder: "Aug 15, 2023",
    initials: "RL",
    initialsBg: "bg-secondary-container text-secondary font-bold",
  },
  {
    id: "#K3-5001",
    name: "Emily Knight",
    email: "em.knight@web.com",
    phone: "(555) 222-0000",
    totalOrders: 112,
    walletBalance: 560.0,
    status: "Active",
    lastOrder: "Nov 05, 2023",
    initials: "EK",
    initialsBg: "bg-primary-fixed text-primary font-bold",
  },
  {
    id: "#K3-2219",
    name: "Martha Stewart",
    email: "m.stewart@domain.net",
    phone: "(555) 777-8899",
    totalOrders: 24,
    walletBalance: 88.25,
    status: "Active",
    lastOrder: "Oct 28, 2023",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
  },
];

export const CustomersPage: React.FC = () => {
  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { setSearchQuery, setCustomActionHandler } = useHeaderStore();

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [spendFilter, setSpendFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerDetail, setSelectedCustomerDetail] =
    useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Register custom action handler for TopNavigationBar primary button on this page
  useEffect(() => {
    setCustomActionHandler(() => {
      setIsAddModalOpen(true);
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler]);

  // Filtered customers logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Spend filter
      if (spendFilter === "High Value") {
        if (customer.walletBalance <= 500) return false;
      } else if (spendFilter === "Mid Range") {
        if (customer.walletBalance < 100 || customer.walletBalance > 500)
          return false;
      } else if (spendFilter === "New Customers") {
        if (customer.walletBalance >= 100) return false;
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
  }, [customers, spendFilter, dateFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSpendFilter("All");
    setDateFilter("All");
    setStatusFilter("All");
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
            `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.walletBalance},"${c.status}","${c.lastOrder}"`,
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

  const handleAddCustomer = (formData: AddCustomerFormInputs) => {
    const initials = formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const newCustomer: Customer = {
      id: `#K3-${randomNum}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalOrders: 0,
      walletBalance: parseFloat(formData.walletBalance) || 0,
      status: "Active",
      lastOrder: "Just now",
      initials,
      initialsBg: "bg-primary-fixed text-primary font-bold",
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setIsAddModalOpen(false);

    showSnackbar({
      message: `Customer ${newCustomer.name} added successfully!`,
      type: "success",
    });
  };

  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === "Active" ? "Suspended" : "Active";
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c)),
    );
    setOpenActionMenuId(null);
    showSnackbar({
      message: `Customer ${customer.name} status updated to ${newStatus}`,
      type: newStatus === "Active" ? "success" : "warning",
    });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
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
        customers={filteredCustomers}
        totalCount={customers.length}
        selectedRowId={selectedRowId}
        openActionMenuId={openActionMenuId}
        onSelectRow={setSelectedRowId}
        onToggleMenu={setOpenActionMenuId}
        onViewDetails={setSelectedCustomerDetail}
        onToggleStatus={handleToggleStatus}
        onDeleteCustomer={handleDeleteCustomer}
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />

      {/* Add Customer Modal Component */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomer}
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
