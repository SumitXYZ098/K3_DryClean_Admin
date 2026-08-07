import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import useOrderStore, {
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
import FleetActivityCard from "../../components/orders/FleetActivityCard";
import ServiceEfficiencyCard from "../../components/orders/ServiceEfficiencyCard";
import CreateOrderModal from "../../components/orders/CreateOrderModal";
import OrderDetailModal from "../../components/orders/OrderDetailModal";
import UpdateOrderStatusModal from "../../components/orders/UpdateOrderStatusModal";
import AssignDriverModal from "../../components/orders/AssignDriverModal";

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { searchQuery, setSearchQuery, setCustomActionHandler } =
    useHeaderStore();

  const {
    orders,
    fleetActivities,
    addOrder,
    updateOrderStatus,
    updateOrderPaymentStatus,
    assignDriver,
    deleteOrder,
  } = useOrderStore();

  // Filters State
  const [activeTab, setActiveTab] = useState("All");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Oct 20 - Oct 27, 2023");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(
    null
  );
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);
  const [assignDriverOrder, setAssignDriverOrder] = useState<Order | null>(null);

  // Sync custom header button with Create New Order page
  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/orders/create");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  // Handle Tab Change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    if (tabId === "All") {
      setStatusFilter("All");
    } else if (tabId === "In-Progress") {
      setStatusFilter("Processing");
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
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomer = order.customerName.toLowerCase().includes(query);
        const matchesStatus = order.status.toLowerCase().includes(query);
        const matchesDriver = order.driver?.name.toLowerCase().includes(query);
        if (!matchesId && !matchesCustomer && !matchesStatus && !matchesDriver) {
          return false;
        }
      }

      // Tab Filter
      if (activeTab === "Pending" && order.status !== "Pending") return false;
      if (activeTab === "In-Progress" && order.status !== "Processing")
        return false;
      if (activeTab === "Ready" && order.status !== "Ready") return false;
      if (activeTab === "Delivered" && order.status !== "Delivered")
        return false;

      // Dropdown Status Filter
      if (statusFilter !== "All" && order.status !== statusFilter) {
        return false;
      }

      // Dropdown Service Type Filter
      if (
        serviceTypeFilter !== "All" &&
        order.serviceType !== serviceTypeFilter
      ) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, activeTab, statusFilter, serviceTypeFilter]);

  // Pagination calculation
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
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
    setSearchQuery("");
    setCurrentPage(1);
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
        "Order ID,Customer Name,Customer Tier,Pickup Date,Delivery Date,Driver,Payment,Status,Total Amount\n";
      const rows = filteredOrders
        .map(
          (o) =>
            `"${o.id}","${o.customerName}","${o.customerTier}","${
              o.pickupDate
            }","${o.deliveryDate}","${o.driver?.name || "Unassigned"}","${
              o.paymentStatus
            }","${o.status}",${o.totalAmount}`
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

  const handleCreateOrder = (
    newOrderData: Omit<Order, "id" | "createdAt">
  ) => {
    const created = addOrder(newOrderData);
    showSnackbar({
      message: `Order ${created.id} created for ${created.customerName}`,
      type: "success",
    });
  };

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    updateOrderStatus(id, newStatus);
    showSnackbar({
      message: `Order ${id} status updated to ${newStatus}`,
      type: "success",
    });

    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail({ ...selectedOrderDetail, status: newStatus });
    }
  };

  const handleUpdatePayment = (id: string, payment: PaymentStatus) => {
    updateOrderPaymentStatus(id, payment);
    showSnackbar({
      message: `Order ${id} payment status set to ${payment}`,
      type: "info",
    });

    if (selectedOrderDetail && selectedOrderDetail.id === id) {
      setSelectedOrderDetail({ ...selectedOrderDetail, paymentStatus: payment });
    }
  };

  const handleAssignDriver = (orderId: string, driver: DriverInfo) => {
    assignDriver(orderId, driver);
    showSnackbar({
      message: `Driver ${driver.name} assigned to Order ${orderId}`,
      type: "success",
    });
  };

  const handleDeleteOrder = (order: Order) => {
    deleteOrder(order.id);
    showSnackbar({
      message: `Order ${order.id} deleted`,
      type: "warning",
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
        onStatClick={(status) => {
          setStatusFilter(status);
          setActiveTab(
            status === "Processing" ? "In-Progress" : status
          );
        }}
      />

      {/* Filters & Tables Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Filter Tabs */}
        <OrderFilterTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          totalOrdersCount={orders.length}
        />

        {/* Filter Bar */}
        <OrderFilterBar
          serviceTypeFilter={serviceTypeFilter}
          onServiceTypeChange={setServiceTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Data Table Component */}
        <OrderTable
          orders={paginatedOrders}
          totalOrdersCount={filteredOrders.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={(ord) => setSelectedOrderDetail(ord)}
          onUpdateStatus={(ord) => setStatusModalOrder(ord)}
          onAssignDriver={(ord) => setAssignDriverOrder(ord)}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>

      {/* Footer Task Cards (Bento Extension) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <FleetActivityCard
          activities={fleetActivities}
          onViewFleetMap={() => {
            showSnackbar({
              message: "Opening Fleet Logistics Map view...",
              type: "info",
            });
          }}
        />

        <ServiceEfficiencyCard
          onOpenReport={() => {
            showSnackbar({
              message: "Opening Full Operations & Efficiency Analytics Report...",
              type: "info",
            });
          }}
        />
      </div>

      {/* Floating Micro-Interaction Help Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          type="button"
          onClick={() =>
            showSnackbar({
              message: "Need assistance? Contact K3 DryClean Operations Support at ext 402.",
              type: "info",
            })
          }
          className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform group cursor-pointer"
          title="Help & Support"
        >
          <span
            className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform"
            data-icon="help"
          >
            help
          </span>
        </button>
      </div>

      {/* Modals */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrder}
      />

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
