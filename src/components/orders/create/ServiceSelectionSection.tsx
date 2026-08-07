import type React from "react";

export interface SelectedServiceItem {
  id: string;
  serviceType: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceSelectionSectionProps {
  items: SelectedServiceItem[];
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof SelectedServiceItem,
    value: string | number
  ) => void;
  onDeleteItem: (id: string) => void;
}

export const itemPrices: Record<string, number> = {
  "Suit (2-piece)": 18.5,
  "Dress Shirt": 4.0,
  "Cotton Trousers": 7.5,
  "Saree (Silk)": 15.0,
  "Winter Coat": 22.0,
  "Leather Jacket": 35.0,
  "Curtains/Drapes": 25.0,
};

export const ServiceSelectionSection: React.FC<ServiceSelectionSectionProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const handleItemSelect = (id: string, itemName: string) => {
    const defaultPrice = itemPrices[itemName] || 10.0;
    onUpdateItem(id, "itemName", itemName);
    onUpdateItem(id, "unitPrice", defaultPrice);
  };

  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-lg shadow-xs space-y-md">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            local_laundry_service
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">
            Services &amp; Items
          </h3>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1 text-primary text-sm font-bold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm" data-icon="add_circle">
            add_circle
          </span>
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold">
                SERVICE TYPE
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold">
                ITEM
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-center">
                QTY
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-right">
                UNIT PRICE
              </th>
              <th className="text-label-sm text-secondary pb-3 px-2 uppercase font-bold text-right">
                TOTAL
              </th>
              <th className="w-10 pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map((item) => {
              const lineTotal = item.quantity * item.unitPrice;
              return (
                <tr key={item.id} className="hover:bg-surface-container-low/50">
                  {/* Service Type Select */}
                  <td className="py-4 px-2">
                    <select
                      value={item.serviceType}
                      onChange={(e) =>
                        onUpdateItem(item.id, "serviceType", e.target.value)
                      }
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:border-primary"
                    >
                      <option value="Dry Cleaning">Dry Cleaning</option>
                      <option value="Laundry">Laundry</option>
                      <option value="Ironing Only">Ironing Only</option>
                      <option value="Steam Press">Steam Press</option>
                    </select>
                  </td>

                  {/* Garment Item Select */}
                  <td className="py-4 px-2">
                    <select
                      value={item.itemName}
                      onChange={(e) => handleItemSelect(item.id, e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-on-surface outline-none focus:border-primary"
                    >
                      <option value="Suit (2-piece)">Suit (2-piece)</option>
                      <option value="Dress Shirt">Dress Shirt</option>
                      <option value="Cotton Trousers">Cotton Trousers</option>
                      <option value="Saree (Silk)">Saree (Silk)</option>
                      <option value="Winter Coat">Winter Coat</option>
                      <option value="Leather Jacket">Leather Jacket</option>
                      <option value="Curtains/Drapes">Curtains/Drapes</option>
                    </select>
                  </td>

                  {/* Qty Input */}
                  <td className="py-4 px-2 w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(
                          item.id,
                          "quantity",
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-full bg-surface border border-outline-variant rounded-lg p-2 text-sm text-center font-bold text-on-surface outline-none focus:border-primary"
                    />
                  </td>

                  {/* Unit Price */}
                  <td className="py-4 px-2 text-right font-medium text-on-surface">
                    ${item.unitPrice.toFixed(2)}
                  </td>

                  {/* Line Total */}
                  <td className="py-4 px-2 text-right font-bold text-on-surface">
                    ${lineTotal.toFixed(2)}
                  </td>

                  {/* Action Delete */}
                  <td className="py-4 px-2 text-right">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => onDeleteItem(item.id)}
                      className="text-outline hover:text-error transition-colors disabled:opacity-30 cursor-pointer"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-md">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServiceSelectionSection;
