/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useOrderStore from "../../store/useOrderStore";
import useSnackbarStore from "../../store/useSnackbarStore";

import dayjs from "dayjs";
import orderApi, {
  type CreateOrderApiPayload,
  type CreateOrderItemPayload,
  type ServiceWithVariants,
} from "../../api/orderApi";
import CustomerDetailsSection, {
  type CustomerDetailsData,
} from "../../components/orders/create/CustomerDetailsSection";
import ServiceSelectionSection, {
  type SelectedServiceItem,
} from "../../components/orders/create/ServiceSelectionSection";
import LogisticsSection, {
  type LogisticsData,
} from "../../components/orders/create/LogisticsSection";
import OrderSummaryCard from "../../components/orders/create/OrderSummaryCard";
import StaffInstructionsCard from "../../components/orders/create/StaffInstructionsCard";
import DeliveryMapCard from "../../components/orders/create/DeliveryMapCard";
import useHeaderStore from "../../store/useHeaderStore";

export const CreateOrderPage: React.FC = () => {
  const { setCustomActionHandler } = useHeaderStore();
  const navigate = useNavigate();
  const { addOrder } = useOrderStore();
  const { showSnackbar } = useSnackbarStore();

  const [availableServices, setAvailableServices] = useState<
    ServiceWithVariants[]
  >([]);

  // Auto-fetch services catalog for documentId mapping
  useEffect(() => {
    orderApi
      .getServicesWithVariants()
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setAvailableServices(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch services list for payload mapping", err);
      });
  }, []);

  // Sync custom header button with Create New Order page
  useEffect(() => {
    setCustomActionHandler(() => {
      navigate("/orders/create");
    });

    return () => {
      setCustomActionHandler(null);
    };
  }, [setCustomActionHandler, navigate]);

  // Form State
  const [customerDetails, setCustomerDetails] = useState<CustomerDetailsData>({
    isNewCustomer: false,
    fullName: "",
    phone: "",
    email: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [items, setItems] = useState<SelectedServiceItem[]>([]);

  const currentHour = dayjs().hour();
  const allSlotsPassedToday = currentHour >= 16;
  const initialPickupDate = allSlotsPassedToday
    ? dayjs().add(1, "day").format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");
  const initialDeliveryDate = dayjs(initialPickupDate)
    .add(2, "day")
    .format("YYYY-MM-DD");

  const [logistics, setLogistics] = useState<LogisticsData>({
    pickupDate: initialPickupDate,
    pickupTimeSlot: "09:00 - 11:00",
    deliveryDate: initialDeliveryDate,
    deliveryTimeSlot: "09:00 - 11:00",
    isExpress: false,
  });

  const [staffInstructions, setStaffInstructions] = useState("");

  // Payment is fixed to Pay on Delivery
  const paymentMethod = "Pay on Delivery";
  const [isConfirming, setIsConfirming] = useState(false);

  // Handlers
  const handleCustomerDetailsChange = (
    field: keyof CustomerDetailsData,
    value: any,
  ) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectCustomer = (customer: any) => {
    setCustomerDetails((prev) => ({
      ...prev,
      fullName: customer.name,
      phone: customer.phone,
      email: customer.email,
      selectedCustomerId: customer.documentId || customer.id,
    }));
    showSnackbar({
      message: `Selected customer: ${customer.name}`,
      type: "success",
    });
  };

  const handleSelectAddress = (addressObj: any, addressStr: string) => {
    setCustomerDetails((prev) => ({
      ...prev,
      selectedAddressObj: addressObj,
      address: addressStr,
    }));
    setDeliveryAddress(addressStr);
  };

  const handleLogisticsChange = (
    field: keyof LogisticsData,
    value: boolean | string,
  ) => {
    setLogistics((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddServiceItem = (
    defaultService = "dry cleaning",
    defaultItem = "T-shirt",
    defaultPrice = 89,
    serviceDocumentId?: string,
    variantDocumentId?: string,
  ) => {
    const newItem: SelectedServiceItem = {
      id: Date.now().toString(),
      serviceType: defaultService,
      itemName: defaultItem,
      quantity: 1,
      unitPrice: defaultPrice,
      serviceDocumentId,
      variantDocumentId,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateServiceItem = (
    id: string,
    field: keyof SelectedServiceItem,
    value: string | number | boolean,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteServiceItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce(
    (acc, curr) =>
      acc +
      curr.quantity * (curr.unitPrice + (curr.isExpressDelivery ? 50 : 0)),
    0,
  );
  const deliveryFee = 0.0;
  const totalAmount = subtotal + deliveryFee;

  const formatSlotToTime = (slot: string): string => {
    if (!slot) return "09:00:00";
    const startStr = slot.split("-")[0]?.trim() || "09:00";
    if (startStr.length === 5) {
      return `${startStr}:00`;
    }
    return startStr;
  };

  const handleConfirmOrder = async () => {
    if (
      !customerDetails.selectedCustomerId &&
      !customerDetails.fullName.trim()
    ) {
      showSnackbar({
        message: "Please search and select a customer before confirming order.",
        type: "error",
      });
      return;
    }
    if (!customerDetails.phone.trim()) {
      showSnackbar({
        message: "Customer Phone Number is required.",
        type: "error",
      });
      return;
    }
    if (items.length === 0) {
      showSnackbar({
        message: "Please add at least one service item to the order.",
        type: "error",
      });
      return;
    }

    const addressDocId = String(
      customerDetails.selectedAddressObj?.documentId ||
        customerDetails.selectedAddressObj?.id ||
        "",
    );

    if (!addressDocId) {
      showSnackbar({
        message: "Please select a customer delivery address.",
        type: "error",
      });
      return;
    }

    setIsConfirming(true);

    // Build items payload with service and service_varient documentIds
    const apiItems: CreateOrderItemPayload[] = items.map((it) => {
      let serviceDocId = it.serviceDocumentId;
      let variantDocId = it.variantDocumentId;

      if (!serviceDocId || !variantDocId) {
        const matchedService = availableServices.find(
          (s) =>
            s.name.trim().toLowerCase() ===
              it.serviceType.trim().toLowerCase() ||
            s.documentId === it.serviceType,
        );
        serviceDocId = matchedService?.documentId || serviceDocId || "";

        const variants =
          matchedService?.varients || matchedService?.variants || [];
        const matchedVariant = variants.find(
          (v) =>
            v.name.trim().toLowerCase() === it.itemName.trim().toLowerCase() ||
            v.documentId === it.itemName,
        );
        variantDocId = matchedVariant?.documentId || variantDocId || "";
      }

      return {
        service: String(serviceDocId || ""),
        service_varient: String(variantDocId || ""),
        quantity: it.quantity,
        expressDelivery: !!it.isExpressDelivery,
      };
    });

    const payload: CreateOrderApiPayload = {
      userProfile: String(customerDetails.selectedCustomerId || ""),
      items: apiItems,
      pickup_address: addressDocId,
      delivery_address: addressDocId,
      pickupDate: logistics.pickupDate,
      pickupTime: formatSlotToTime(logistics.pickupTimeSlot),
      deliveryDate: logistics.deliveryDate,
      deliveryTime: formatSlotToTime(logistics.deliveryTimeSlot),
    };

    try {
      // Call backend API endpoint /api/admin/create-order
      await orderApi.createOrder(payload);

      // Add Order to local store for UI synchronization
      const primaryService = (items[0]?.serviceType || "Dry Clean Only") as any;

      const createdOrder = addOrder({
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        pickupDate: `${logistics.pickupDate}, ${logistics.pickupTimeSlot}`,
        deliveryDate: `${logistics.deliveryDate}, ${logistics.deliveryTimeSlot}`,
        pickupPerson: null,
        deliveryPerson: null,
        paymentStatus: "Unpaid",
        status: "pending",
        serviceType: primaryService,
        totalAmount,
        items: items.map((it) => ({
          id: it.id,
          name: `${it.serviceType} - ${it.itemName}${it.isExpressDelivery ? " (Express Delivery)" : ""}`,
          quantity: it.quantity,
          price: it.unitPrice + (it.isExpressDelivery ? 50 : 0),
        })),
        deliveryAddress: deliveryAddress || "",
        specialInstructions: staffInstructions,
      });

      setIsConfirming(false);

      showSnackbar({
        message: `Order ${createdOrder.id} created successfully!`,
        type: "success",
      });

      setTimeout(() => {
        navigate("/orders");
      }, 800);
    } catch (err: any) {
      setIsConfirming(false);
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to create order";

      showSnackbar({
        message: errMsg,
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-24 space-y-xl animate-fade-in">
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md mb-xl">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-secondary mb-2">
            <Link to="/orders" className="hover:text-primary transition-colors">
              Orders
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">New Order</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Create New Order
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Register a new laundry or dry cleaning request for a customer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isConfirming}
            onClick={handleConfirmOrder}
            className="px-xl py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75"
          >
            Confirm Order
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Form Area (8 cols) */}
        <div className="col-span-12 lg:col-span-9 space-y-gutter">
          {/* Customer Details */}
          <CustomerDetailsSection
            data={customerDetails}
            onChange={handleCustomerDetailsChange}
            onSelectCustomer={handleSelectCustomer}
            onSelectAddress={handleSelectAddress}
          />

          {/* Services & Items */}
          <ServiceSelectionSection
            items={items}
            onAddItem={handleAddServiceItem}
            onUpdateItem={handleUpdateServiceItem}
            onDeleteItem={handleDeleteServiceItem}
          />

          {/* Pickup & Delivery */}
          <LogisticsSection data={logistics} onChange={handleLogisticsChange} />
        </div>

        {/* Sidebar / Order Summary (4 cols) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-22 space-y-gutter">
            {/* Order Summary Card */}
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={totalAmount}
              paymentMethod={paymentMethod}
              isConfirming={isConfirming}
              onConfirmOrder={handleConfirmOrder}
            />

            {/* Staff Instructions Card */}
            <StaffInstructionsCard
              value={staffInstructions}
              onChange={setStaffInstructions}
            />

            {/* Delivery Map Preview Card */}
            <DeliveryMapCard
              address={deliveryAddress}
              selectedAddressObj={customerDetails.selectedAddressObj}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
