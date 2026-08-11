import type React from "react";
import { useState } from "react";
import type {
  Order,
  ServiceType,
  PaymentStatus,
  OrderStatus,
  DriverInfo,
} from "../../store/useOrderStore";
import useOrderStore from "../../store/useOrderStore";

export interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newOrder: Omit<Order, "id" | "createdAt">) => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { availableDrivers } = useOrderStore();

  const [customerName, setCustomerName] = useState("");
  const [customerTier, setCustomerTier] =
    useState<Order["customerTier"]>("Premium Membership");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("Dry Clean Only");
  const [pickupDate, setPickupDate] = useState("Oct 26, 09:00 AM");
  const [deliveryDate, setDeliveryDate] = useState("Oct 28, 05:00 PM");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Paid");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Items
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(25);
  const [items, setItems] = useState<Order["items"]>([
    { id: "1", name: "Suit Jacket & Trousers", quantity: 1, price: 32.5 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: itemName,
        quantity: Number(itemQty),
        price: Number(itemPrice),
      },
    ]);
    setItemName("");
    setItemQty(1);
    setItemPrice(25);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalAmount = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const assignedDriver: DriverInfo | null =
      availableDrivers.find((d) => d.id === selectedDriverId) || null;

    onSubmit({
      customerName,
      customerTier,
      customerPhone: customerPhone || "(555) 000-1122",
      customerEmail: customerEmail || "customer@example.com",
      serviceType,
      pickupDate,
      deliveryDate,
      driver: assignedDriver,
      paymentStatus,
      status,
      totalAmount,
      items,
      deliveryAddress: deliveryAddress || "123 Main Street, Sector 1",
      specialInstructions,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-surface border border-outline-variant rounded-xl max-w-2xl w-full p-lg shadow-xl max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between border-b border-outline-variant pb-md mb-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              add_circle
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Create New Order
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          {/* Customer Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Jessica Alba"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Membership Tier
              </label>
              <select
                value={customerTier}
                onChange={(e) =>
                  setCustomerTier(e.target.value as Order["customerTier"])
                }
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Premium Membership">Premium Membership</option>
                <option value="Guest Order">Guest Order</option>
                <option value="Bulk/Commercial">Bulk/Commercial</option>
                <option value="Mobile User">Mobile User</option>
                <option value="VIP Client">VIP Client</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Dry Clean Only">Dry Clean Only</option>
                <option value="Wash & Fold">Wash & Fold</option>
                <option value="Ironing">Ironing</option>
                <option value="Household Items">Household Items</option>
              </select>
            </div>
          </div>

          {/* Dates & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Pickup Date & Time
              </label>
              <input
                type="text"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                placeholder="Oct 26, 09:00 AM"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Estimated Delivery Date
              </label>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                placeholder="Oct 28, 05:00 PM"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Assign Driver
              </label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.initials})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as PaymentStatus)
                }
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="pickup_assigned">Pickup Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="processing">Processing</option>
                <option value="delivery_assigned">Delivery Assigned</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Garments Breakdown */}
          <div className="border border-outline-variant p-md rounded-lg bg-surface-container-lowest">
            <h4 className="font-title-md text-sm text-on-surface mb-2">
              Garments & Items Breakdown
            </h4>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                placeholder="Item name (e.g. Wool Coat)"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface outline-none"
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value))}
                className="w-20 bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface outline-none"
              />
              <input
                type="number"
                step="0.5"
                placeholder="Price ($)"
                value={itemPrice}
                onChange={(e) => setItemPrice(Number(e.target.value))}
                className="w-24 bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface outline-none"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-secondary text-on-secondary rounded text-sm font-bold hover:bg-opacity-90"
              >
                Add
              </button>
            </div>

            {items.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between text-xs p-2 bg-surface-container-low rounded border border-outline-variant/40"
                  >
                    <span>
                      {it.quantity}x {it.name} (${it.price.toFixed(2)} ea)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        ${(it.quantity * it.price).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 text-right font-bold text-sm text-on-surface">
              Total Amount:{" "}
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Address & Notes */}
          <div>
            <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Full street address and apartment/unit #"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-label-sm uppercase font-bold text-on-surface-variant mb-1">
              Special Handling Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Fragile buttons, stain treatment on sleeves..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-md border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant rounded-lg text-sm text-secondary hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
