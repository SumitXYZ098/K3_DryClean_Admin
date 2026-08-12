/* eslint-disable react-hooks/set-state-in-effect */
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import useSnackbarStore from "../../store/useSnackbarStore";
import useLoadingStore from "../../store/useLoadingStore";
import useHeaderStore from "../../store/useHeaderStore";
import useDriverHook from "../../hooks/useDriverHook";
import type { Driver } from "../../store/useDriverStore";

import DriverFilterBar from "../../components/drivers/DriverFilterBar";
import DriverTable from "../../components/drivers/DriverTable";
import DriverDetailModal from "../../components/drivers/DriverDetailModal";
import EditDriverModal from "../../components/drivers/EditDriverModal";
import DeleteDriverModal from "../../components/drivers/DeleteDriverModal";

export const DriversPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { searchQuery, setSearchQuery, setCustomActionHandler } =
    useHeaderStore();

  const {
    drivers,
    fetchDrivers,
    updateDriver,
    deleteDriver,
    toggleDriverStatus,
  } = useDriverHook();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal States
  const [selectedViewDriver, setSelectedViewDriver] = useState<Driver | null>(
    null,
  );
  const [selectedEditDriver, setSelectedEditDriver] = useState<Driver | null>(
    null,
  );
  const [selectedDeleteDriver, setSelectedDeleteDriver] =
    useState<Driver | null>(null);

  // Fetch driver roster from backend API on mount
  useEffect(() => {
    fetchDrivers().catch(() => {
      // API error handled via interceptor / hook error state
    });
  }, [fetchDrivers]);

  // Set TopNavigationBar primary button action for this page
  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/drivers/add");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  // Filter drivers based on header search and status tab
  const filteredDrivers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return drivers.filter((driver) => {
      // Search query filter
      if (query) {
        const matchName = driver.fullName?.toLowerCase().includes(query);
        const matchPhone = driver.phoneNumber?.toLowerCase().includes(query);
        const matchVehicle = driver.vehicleNumber
          ?.toLowerCase()
          .includes(query);
        const matchId = driver.documentId?.toLowerCase().includes(query);

        if (!matchName && !matchPhone && !matchVehicle && !matchId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === "Active" && !driver.isActive) return false;
      if (statusFilter === "Offline" && driver.isActive) return false;

      return true;
    });
  }, [drivers, searchQuery, statusFilter]);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Pagination calculation
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / itemsPerPage),
  );

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage, itemsPerPage]);

  const onlineCount = useMemo(() => {
    return drivers.filter((d) => d.isActive).length;
  }, [drivers]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
    showSnackbar({
      message: "Driver filters cleared",
      type: "info",
    });
  };

  const handleExportCSV = () => {
    showLoading("Exporting Driver Roster CSV...");
    setTimeout(() => {
      hideLoading();
      const headers =
        "Driver ID,Name,Phone,Email,Vehicle Number,Status,Pickup Orders,Delivery Orders\n";
      const rows = filteredDrivers
        .map(
          (d) =>
            `"${d.documentId}","${d.fullName}","${d.phoneNumber}","${d.email}","${d.vehicleNumber}","${d.isActive ? "Active" : "Offline"}",${d.pickupOrdersCount},${d.deliveryOrdersCount}`,
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `k3_drivers_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      showSnackbar({
        message: "Driver roster exported successfully!",
        type: "success",
      });
    }, 600);
  };

  return (
    <div className="space-y-lg animate-fade-in relative pb-20">
      {/* Header & Filter Bar */}
      <DriverFilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onlineCount={onlineCount}
        totalCount={drivers.length}
        onClearFilters={handleClearFilters}
        onExportCSV={handleExportCSV}
      />

      {/* Driver List Table */}
      <DriverTable
        drivers={paginatedDrivers}
        totalCount={filteredDrivers.length}
        onViewDetails={(driver) => setSelectedViewDriver(driver)}
        onEditDriver={(driver) => setSelectedEditDriver(driver)}
        onDeleteDriver={(driver) => setSelectedDeleteDriver(driver)}
        onToggleStatus={toggleDriverStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <DriverDetailModal
        driver={selectedViewDriver}
        onClose={() => setSelectedViewDriver(null)}
        onEdit={(driver) => setSelectedEditDriver(driver)}
      />

      <EditDriverModal
        driver={selectedEditDriver}
        onClose={() => setSelectedEditDriver(null)}
        onSave={async (docId, payload) => {
          await updateDriver(docId, payload);
          await fetchDrivers(true);
        }}
      />

      <DeleteDriverModal
        driver={selectedDeleteDriver}
        onClose={() => setSelectedDeleteDriver(null)}
        onConfirmDelete={async (docId) => {
          await deleteDriver(docId);
          await fetchDrivers(true);
        }}
      />
    </div>
  );
};

export default DriversPage;
