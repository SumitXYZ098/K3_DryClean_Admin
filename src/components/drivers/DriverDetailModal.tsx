/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { type Driver, mapApiDriverToDriver } from "../../store/useDriverStore";

interface DriverDetailModalProps {
  driver: Driver | null;
  onClose: () => void;
  onEdit: (driver: Driver) => void;
}

export const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  driver,
  onClose,
  onEdit,
}) => {
  const [detailData, setDetailData] = useState<Driver | null>(driver);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    if (!driver?.documentId) {
      setDetailData(null);
      return;
    }

    let isMounted = true;
    setDetailData(driver);
    setIsLoadingDetails(true);

    // Fetch individual driver details by documentId
    driverApi
      .getDriverById(driver.documentId)
      .then((response) => {
        if (isMounted && response?.data) {
          const mapped = mapApiDriverToDriver(response.data);
          setDetailData(mapped);
        }
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.warn("[DriverDetailModal] Failed to fetch details:", err);
        }
        // Fallback to initial driver object if endpoint fails
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [driver]);

  const [activeOrderTab, setActiveOrderTab] = useState<"pickup" | "delivery">(
    "pickup"
  );

  if (!driver || !detailData) return null;

  const currentDriver = detailData;
  const pickupOrders = currentDriver.order_pickup || [];
  const deliveryOrders = currentDriver.order_deliver || [];

  const initials = currentDriver.fullName
    ? currentDriver.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fade-in">
      <div className="bg-surface border border-outline-variant rounded-2xl shadow-2xl max-w-160 w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-title-md font-headline-md text-on-surface">
                  {currentDriver.fullName}
                </h3>
                {isLoadingDetails && (
                  <span
                    className="material-symbols-outlined text-primary text-sm animate-spin"
                    title="Fetching live driver details..."
                  >
                    sync
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary">
                Document ID: {currentDriver.documentId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-lg overflow-y-auto space-y-md">
          {/* Status Badge & Vehicle */}
          <div className="flex items-center justify-between bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider font-semibold">
                Vehicle Assignment
              </p>
              <p className="text-body-lg font-bold text-on-surface mt-0.5">
                {currentDriver.vehicleNumber || "No Vehicle Assigned"}
              </p>
            </div>
            <div>
              {currentDriver.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active Driver
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-sm">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-md bg-surface-container-low p-md rounded-xl border border-outline-variant">
              <div>
                <p className="text-xs text-secondary">Phone Number</p>
                <p className="text-sm font-semibold text-on-surface mt-0.5">
                  {currentDriver.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary">Email Address</p>
                <p className="text-sm font-semibold text-on-surface mt-0.5 truncate">
                  {currentDriver.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Logistics Performance & Assigned Orders */}
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">
                Assigned Orders
              </h4>
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant text-xs">
                <button
                  type="button"
                  onClick={() => setActiveOrderTab("pickup")}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    activeOrderTab === "pickup"
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-secondary hover:text-on-surface"
                  }`}
                >
                  Pickups ({pickupOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOrderTab("delivery")}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    activeOrderTab === "delivery"
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-secondary hover:text-on-surface"
                  }`}
                >
                  Deliveries ({deliveryOrders.length})
                </button>
              </div>
            </div>

            {/* Metric Overview Cards */}
            <div className="grid grid-cols-2 gap-md">
              <div
                onClick={() => setActiveOrderTab("pickup")}
                className={`p-md rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeOrderTab === "pickup"
                    ? "bg-primary-container/15 border-primary/40 ring-1 ring-primary/20"
                    : "bg-surface-container-low border-outline-variant hover:bg-surface-container"
                }`}
              >
                <div>
                  <p className="text-xs text-secondary font-semibold">Pickup Orders</p>
                  <p className="text-xl font-headline-md font-bold text-primary mt-0.5">
                    {pickupOrders.length}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl">
                  takeout_dining
                </span>
              </div>

              <div
                onClick={() => setActiveOrderTab("delivery")}
                className={`p-md rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  activeOrderTab === "delivery"
                    ? "bg-primary-container/15 border-primary/40 ring-1 ring-primary/20"
                    : "bg-surface-container-low border-outline-variant hover:bg-surface-container"
                }`}
              >
                <div>
                  <p className="text-xs text-secondary font-semibold">Delivery Orders</p>
                  <p className="text-xl font-headline-md font-bold text-on-surface mt-0.5">
                    {deliveryOrders.length}
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary text-2xl">
                  local_shipping
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="mt-sm">
              {activeOrderTab === "pickup" ? (
                pickupOrders.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pickupOrders.map((ord, idx) => (
                      <div
                        key={ord.documentId || idx}
                        className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
                            <span className="material-symbols-outlined text-[16px]">
                              takeout_dining
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {ord.orderNo}
                            </p>
                            <p className="text-xs text-secondary">Pickup Order</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">
                            ₹{ord.grandTotal?.toLocaleString() ?? 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-secondary italic bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                    No pickup orders assigned to this driver.
                  </p>
                )
              ) : deliveryOrders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {deliveryOrders.map((ord, idx) => (
                    <div
                      key={ord.documentId || idx}
                      className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center font-bold text-xs">
                          <span className="material-symbols-outlined text-[16px]">
                            local_shipping
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {ord.orderNo}
                          </p>
                          <p className="text-xs text-secondary">Delivery Order</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-on-surface">
                          ₹{ord.grandTotal?.toLocaleString() ?? 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary italic bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                  No delivery orders assigned to this driver.
                </p>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">
                Verification Documents
              </h4>
              <span className="text-xs bg-surface-container border border-outline-variant px-2 py-0.5 rounded-full font-bold">
                {currentDriver.documents?.length} Documents
              </span>
            </div>

            {currentDriver.documents && currentDriver.documents.length > 0 ? (
              <div className="space-y-2">
                {currentDriver.documents.map((doc, idx) => {
                  const rawImage =
                    (doc as any).documentImage ||
                    (doc as any).image ||
                    (doc as any).file;

                  let docUrl: string | null = null;
                  if (typeof rawImage === "object" && rawImage?.url) {
                    const url = rawImage.url;
                    docUrl = url.startsWith("http")
                      ? url
                      : `${import.meta.env.VITE_PUBLIC_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
                  } else if (
                    typeof rawImage === "string" &&
                    (rawImage.startsWith("http") || rawImage.startsWith("/"))
                  ) {
                    docUrl = rawImage.startsWith("http")
                      ? rawImage
                      : `${import.meta.env.VITE_PUBLIC_BASE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;
                  }

                  let docSize = "245 KB";
                  const sizeVal =
                    (typeof rawImage === "object" && rawImage?.size) ||
                    (doc as any).size;
                  if (sizeVal) {
                    docSize =
                      sizeVal >= 1024
                        ? `${(sizeVal / 1024).toFixed(1)} MB`
                        : `${Math.round(sizeVal)} KB`;
                  }

                  return (
                    <div
                      key={doc.id || idx}
                      className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant hover:bg-surface-container-lowest transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">
                          description
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            {doc.documentName || `Document #${idx + 1}`}
                          </p>
                          <p className="text-xs text-secondary">{docSize}</p>
                        </div>
                      </div>

                      {docUrl ? (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-primary border border-primary/30 hover:bg-primary-container/20 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          View
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // View preview fallback
                            window.open("#", "_blank");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-primary border border-primary/30 hover:bg-primary-container/20 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            visibility
                          </span>
                          View
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-secondary italic bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                No documents uploaded yet for this driver.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-md">
          <button
            type="button"
            onClick={onClose}
            className="px-md py-2 border border-outline-variant rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(currentDriver);
            }}
            className="px-md py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailModal;
