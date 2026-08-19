import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import dayjs from "dayjs";
import useOrders from "../../hooks/useOrders";
import {
  type Order,
  type OrderStatus,
  type PaymentStatus,
  type DriverInfo,
} from "../../store/useOrderStore";
import useSnackbarStore from "../../store/useSnackbarStore";
import useLoadingStore from "../../store/useLoadingStore";
import useHeaderStore from "../../store/useHeaderStore";

import OrderStatsBento from "../../components/orders/OrderStatsBento";
import OrderFilterTabs from "../../components/orders/OrderFilterTabs";
import OrderFilterBar from "../../components/orders/OrderFilterBar";
import OrderTable from "../../components/orders/OrderTable";
import OrderDetailModal from "../../components/orders/OrderDetailModal";
import UpdateOrderStatusModal from "../../components/orders/UpdateOrderStatusModal";
import AssignDriverModal from "../../components/orders/AssignDriverModal";

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { searchQuery, setSearchQuery, setCustomActionHandler } =
    useHeaderStore();

  const {
    orders,
    isLoading,
    updateOrderStatus,
    updateOrderPaymentStatus,
    assignDriver,
  } = useOrders();

  // Filters State
  const [activeTab, setActiveTab] = useState("today_pickup");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(
    null,
  );
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [assignDriverOrder, setAssignDriverOrder] = useState<Order | null>(
    null,
  );

  // Sync custom header button with Create New Order page
  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/orders/create");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  // Sync URL search query param with header search store
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl !== null) {
      setSearchQuery(searchFromUrl);
    } else {
      setSearchQuery("");
    }
  }, [searchParams, setSearchQuery]);

  // Derive active tab and status filter when a search query is active
  const hasSearch = Boolean(searchQuery.trim() || searchParams.get("search"));
  const effectiveActiveTab = hasSearch ? "All" : activeTab;
  const effectiveStatusFilter = hasSearch ? "All" : statusFilter;

  // Handle Tab Change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    if (tabId === "All" || tabId === "today_pickup") {
      setStatusFilter("All");
    } else {
      setStatusFilter(tabId);
    }
  };

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search query matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId =
          (order.id || "").toLowerCase().includes(query) ||
          (order.documentId && order.documentId.toLowerCase().includes(query));
        const matchesCustomer = (order.customerName || "")
          .toLowerCase()
          .includes(query);
        const matchesStatus = (order.status || "")
          .toLowerCase()
          .includes(query);
        if (!matchesId && !matchesCustomer && !matchesStatus) {
          return false;
        }
      }

      // Tab Filter
      if (effectiveActiveTab === "today_pickup") {
        const todayStr = dayjs().format("YYYY-MM-DD");
        const todayFormatted = dayjs().format("MMM D, YYYY");
        const orderPickup = dayjs(order.pickupDate).isValid()
          ? dayjs(order.pickupDate).format("YYYY-MM-DD")
          : "";

        const isTodayPickup =
          orderPickup === todayStr ||
          (Boolean(order.pickupDate) &&
            order.pickupDate.includes(todayFormatted)) ||
          (Boolean(order.pickupDate) && order.pickupDate.includes(todayStr));

        if (!isTodayPickup) {
          return false;
        }
      } else if (
        effectiveActiveTab !== "All" &&
        order.status !== effectiveActiveTab
      ) {
        return false;
      }

      // Dropdown Status Filter
      if (
        effectiveStatusFilter !== "All" &&
        order.status !== effectiveStatusFilter
      ) {
        return false;
      }

      // Dropdown Service Type Filter
      if (
        serviceTypeFilter !== "All" &&
        order.serviceType !== serviceTypeFilter
      ) {
        return false;
      }

      // Date Filter matching
      if (dateRange) {
        const selectedDate = dayjs(dateRange).format("YYYY-MM-DD");

        const createdDate = dayjs(order.createdAt).isValid()
          ? dayjs(order.createdAt).format("YYYY-MM-DD")
          : "";
        const pickupDate = dayjs(order.pickupDate).isValid()
          ? dayjs(order.pickupDate).format("YYYY-MM-DD")
          : "";

        const matchesDate =
          createdDate === selectedDate ||
          pickupDate === selectedDate ||
          order.pickupDate.includes(dateRange);

        if (!matchesDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    orders,
    searchQuery,
    effectiveActiveTab,
    effectiveStatusFilter,
    serviceTypeFilter,
    dateRange,
  ]);

  // Pagination calculation
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage),
  );
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Actions
  const handleApplyFilters = () => {
    setCurrentPage(1);
    showSnackbar({
      message: `Filters applied: ${filteredOrders.length} orders found`,
      type: "info",
    });
  };

  const handleClearFilters = () => {
    setActiveTab("All");
    setServiceTypeFilter("All");
    setStatusFilter("All");
    setDateRange("");
    setSearchQuery("");
    setCurrentPage(1);
    navigate("/orders");
    showSnackbar({
      message: "Order filters cleared",
      type: "info",
    });
  };

  const handleExportList = () => {
    showLoading("Preparing orders export file...");
    setTimeout(() => {
      hideLoading();
      const headers =
        "Order ID,Customer Name,Pickup Date,Delivery Date,Pickup Driver,Delivery Driver,Payment,Status,Total Amount\n";
      const rows = filteredOrders
        .map(
          (o) =>
            `"${o.id}","${o.customerName}","${
              o.pickupDate
            }","${o.deliveryDate}","${o.pickupPerson?.name || "Unassigned"}","${
              o.deliveryPerson?.name || "Unassigned"
            }","${o.paymentStatus}","${o.status}",${o.totalAmount}`,
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `k3_orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showSnackbar({
        message: "Order list exported successfully!",
        type: "success",
      });
    }, 800);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: OrderStatus,
    driver?: DriverInfo,
  ) => {
    if (
      driver &&
      (newStatus === "pickup_assigned" || newStatus === "delivery_assigned")
    ) {
      // When a driver is selected, call ONLY assignDriver (not updateOrderStatus)
      assignDriver(id, driver);
      showSnackbar({
        message: `Order ${id} assigned to driver ${driver.name}`,
        type: "success",
      });
    } else if (
      newStatus === "pickup_assigned" ||
      newStatus === "delivery_assigned"
    ) {
      // Do NOT call updateOrderStatus without a driver. Open AssignDriverModal directly instead.
      const targetOrder =
        orders.find((o) => o.id === id || o.documentId === id) ||
        statusModalOrder ||
        selectedOrderDetail;

      if (targetOrder) {
        setSelectedOrderDetail(null);
        setStatusModalOrder(null);
        setAssignDriverOrder({ ...targetOrder, status: newStatus });
      }
      return;
    } else {
      // For all other statuses, perform standard status update
      updateOrderStatus(id, newStatus);
      showSnackbar({
        message: `Order ${id} status updated to ${newStatus.replace(/_/g, " ")}`,
        type: "success",
      });
    }

    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail({
        ...selectedOrderDetail,
        status: newStatus,
        ...(driver
          ? newStatus === "pickup_assigned"
            ? { pickupPerson: driver }
            : { deliveryPerson: driver }
          : {}),
      });
    }
  };

  const handleUpdatePayment = (id: string, payment: PaymentStatus) => {
    updateOrderPaymentStatus(id, payment);
    showSnackbar({
      message: `Order ${id} payment status set to ${payment}`,
      type: "info",
    });

    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail({
        ...selectedOrderDetail,
        paymentStatus: payment,
      });
    }
  };

  const handleAssignDriver = (orderId: string, driver: DriverInfo) => {
    assignDriver(orderId, driver);
    showSnackbar({
      message: `Driver ${driver.name} assigned to Order ${orderId}`,
      type: "success",
    });
  };

  return (
    <div className="space-y-lg animate-fade-in relative pb-16">
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Order Management
          </h2>
          <p className="text-on-surface-variant font-body-md mt-1">
            Manage, track, and optimize daily cleaning logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportList}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-title-md text-sm hover:bg-surface-container transition-colors cursor-pointer text-on-surface"
          >
            <span
              className="material-symbols-outlined text-lg"
              data-icon="download"
            >
              download
            </span>
            Export List
          </button>
          <button
            type="button"
            onClick={() => navigate("/orders/create")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-title-md text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm active:scale-95"
          >
            <span
              className="material-symbols-outlined text-lg"
              data-icon="add_circle"
            >
              add_circle
            </span>
            Create New Order
          </button>
        </div>
      </div>

      {/* Dashboard Style Metric Bento Cards */}
      <OrderStatsBento
        orders={orders}
        isLoading={isLoading}
        onStatClick={(status) => {
          setStatusFilter(status);
          setActiveTab(status);
        }}
      />

      {/* Filters & Tables Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <OrderFilterTabs
          activeTab={effectiveActiveTab}
          onTabChange={handleTabChange}
          totalOrdersCount={orders.length}
        />

        {/* Filter Bar */}
        <OrderFilterBar
          serviceTypeFilter={serviceTypeFilter}
          onServiceTypeChange={setServiceTypeFilter}
          statusFilter={effectiveStatusFilter}
          onStatusFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Data Table Component */}
        <OrderTable
          orders={paginatedOrders}
          isLoading={isLoading}
          totalOrdersCount={filteredOrders.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={(ord) => setSelectedOrderDetail(ord)}
          onUpdateStatus={(ord) => setStatusModalOrder(ord)}
          onAssignDriver={(ord) => setAssignDriverOrder(ord)}
        />
      </div>

      <OrderDetailModal
        order={selectedOrderDetail}
        onClose={() => setSelectedOrderDetail(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
        onAssignDriverClick={(ord) => {
          setSelectedOrderDetail(null);
          setAssignDriverOrder(ord);
        }}
      />

      <UpdateOrderStatusModal
        order={statusModalOrder}
        onClose={() => setStatusModalOrder(null)}
        onUpdate={handleUpdateStatus}
      />

      <AssignDriverModal
        order={assignDriverOrder}
        onClose={() => setAssignDriverOrder(null)}
        onAssign={handleAssignDriver}
      />
    </div>
  );
};

export default OrdersPage;
