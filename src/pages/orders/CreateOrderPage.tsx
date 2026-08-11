/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useOrderStore from "../../store/useOrderStore";
import useCustomerStore from "../../store/useCustomerStore";
import useSnackbarStore from "../../store/useSnackbarStore";

import CustomerDetailsSection, {
  type CustomerDetailsData,
} from "../../components/orders/create/CustomerDetailsSection";
import ServiceSelectionSection, {
  type SelectedServiceItem,
  itemPrices,
} from "../../components/orders/create/ServiceSelectionSection";
import LogisticsSection, {
  type LogisticsData,
} from "../../components/orders/create/LogisticsSection";
import OrderSummaryCard from "../../components/orders/create/OrderSummaryCard";
import StaffInstructionsCard from "../../components/orders/create/StaffInstructionsCard";
import DeliveryMapCard from "../../components/orders/create/DeliveryMapCard";

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder } = useOrderStore();
  const { addCustomer } = useCustomerStore();
  const { showSnackbar } = useSnackbarStore();

  // Form State
  const [customerDetails, setCustomerDetails] = useState<CustomerDetailsData>({
    isNewCustomer: false,
    fullName: "Mark Thompson",
    phone: "+1 (555) 012-3456",
    email: "m.thompson@enterprise.com",
  });

  const [items, setItems] = useState<SelectedServiceItem[]>([
    {
      id: "1",
      serviceType: "Dry Cleaning",
      itemName: "Suit (2-piece)",
      quantity: 2,
      unitPrice: 18.5,
    },
    {
      id: "2",
      serviceType: "Laundry",
      itemName: "Dress Shirt",
      quantity: 5,
      unitPrice: 4.0,
    },
  ]);

  const [logistics, setLogistics] = useState<LogisticsData>({
    pickupDate: "2023-11-24",
    pickupTimeSlot: "14:00 - 16:00",
    deliveryDate: "2023-11-27",
    deliveryTimeSlot: "09:00 - 11:00",
    isExpress: false,
  });

  const [staffInstructions, setStaffInstructions] = useState(
    "Handle silk items with care, extra starch for white shirts...",
  );

  const [paymentMethod, setPaymentMethod] = useState(
    "Pay on Delivery (Default)",
  );
  const [isConfirming, setIsConfirming] = useState(false);

  // Handlers
  const handleCustomerDetailsChange = (
    field: keyof CustomerDetailsData,
    value: boolean | string,
  ) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogisticsChange = (
    field: keyof LogisticsData,
    value: boolean | string,
  ) => {
    setLogistics((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddServiceItem = () => {
    const newItemName = "Cotton Trousers";
    const newItem: SelectedServiceItem = {
      id: Date.now().toString(),
      serviceType: "Dry Cleaning",
      itemName: newItemName,
      quantity: 1,
      unitPrice: itemPrices[newItemName] || 7.5,
    };
    setItems((prev) => [...prev, newItem]);
    showSnackbar({
      message: "Added new service row to order",
      type: "info",
    });
  };

  const handleUpdateServiceItem = (
    id: string,
    field: keyof SelectedServiceItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleDeleteServiceItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce(
    (acc, curr) => acc + curr.quantity * curr.unitPrice,
    0,
  );
  const tax = subtotal * 0.08;
  const expressFee = logistics.isExpress ? 15.0 : 0.0;
  const deliveryFee = 0.0;
  const totalAmount = subtotal + tax + expressFee + deliveryFee;

  const handleConfirmOrder = () => {
    if (!customerDetails.fullName.trim()) {
      showSnackbar({
        message: "Customer Full Name is required.",
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

    setIsConfirming(true);

    setTimeout(() => {
      // Create new customer if toggled
      if (customerDetails.isNewCustomer) {
        addCustomer({
          name: customerDetails.fullName,
          phone: customerDetails.phone,
          email: customerDetails.email,
        });
      }

      // Add Order to store
      const primaryService = (items[0]?.serviceType || "Dry Clean Only") as any;

      const createdOrder = addOrder({
        customerName: customerDetails.fullName,
        customerTier: customerDetails.isNewCustomer
          ? "Guest Order"
          : "Premium Membership",
        customerPhone: customerDetails.phone,
        customerEmail: customerDetails.email,
        pickupDate: `${logistics.pickupDate}, ${logistics.pickupTimeSlot}`,
        deliveryDate: `${logistics.deliveryDate}, ${logistics.deliveryTimeSlot}`,
        driver: null,
        paymentStatus: "Unpaid",
        status: "pending",
        serviceType: primaryService,
        totalAmount,
        items: items.map((it) => ({
          id: it.id,
          name: `${it.serviceType} - ${it.itemName}`,
          quantity: it.quantity,
          price: it.unitPrice,
        })),
        deliveryAddress: "452 Broadway, NY",
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
    }, 1000);
  };

  const handleSaveDraft = () => {
    showSnackbar({
      message: "Order draft saved to local system",
      type: "info",
    });
    setTimeout(() => {
      navigate("/orders");
    }, 600);
  };

  const handleChangePaymentMethod = () => {
    const nextMethod = paymentMethod.includes("Default")
      ? "Credit Card (Ending in 4092)"
      : "Pay on Delivery (Default)";
    setPaymentMethod(nextMethod);
    showSnackbar({
      message: `Payment method updated to: ${nextMethod}`,
      type: "info",
    });
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
            onClick={handleSaveDraft}
            className="px-lg py-2 rounded-lg border border-outline text-on-surface font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Save Draft
          </button>
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
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Customer Details */}
          <CustomerDetailsSection
            data={customerDetails}
            onChange={handleCustomerDetailsChange}
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
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-22 space-y-gutter">
            {/* Order Summary Card */}
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={subtotal}
              tax={tax}
              expressFee={expressFee}
              deliveryFee={deliveryFee}
              total={totalAmount}
              paymentMethod={paymentMethod}
              isConfirming={isConfirming}
              onConfirmOrder={handleConfirmOrder}
              onSaveDraft={handleSaveDraft}
              onChangePaymentMethod={handleChangePaymentMethod}
            />

            {/* Staff Instructions Card */}
            <StaffInstructionsCard
              value={staffInstructions}
              onChange={setStaffInstructions}
            />

            {/* Delivery Map Preview Card */}
            <DeliveryMapCard address="452 Broadway, NY" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;
