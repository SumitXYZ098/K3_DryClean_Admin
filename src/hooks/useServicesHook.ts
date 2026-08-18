/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import useServiceStore from "../store/useServiceStore";
import useSnackbarStore from "../store/useSnackbarStore";
import serviceApi, { type ServiceItemPayload, type ServiceCategoryPayload } from "../api/serviceApi";

export const useServicesHook = () => {
  const {
    categories,
    items,
    selectedCategoryId,
    selectedCategoryName,
    viewMode,
    editingItem,
    editingCategory,
    isLoading,
    error,
    setViewMode,
    selectCategory,
    toggleCategoryStatus,
    toggleItemStatus,
    toggleItemExpressDelivery,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    setEditingItem,
    setEditingCategory,
    fetchServicesAndItems,
  } = useServiceStore();

  const { showSnackbar } = useSnackbarStore();

  // Search & Filter state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchServicesAndItems();
  }, [fetchServicesAndItems]);

  // Active Category details
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find(
      (c) => c.id === selectedCategoryId || c.documentId === selectedCategoryId,
    ) || null;
  }, [categories, selectedCategoryId]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && cat.isActive) ||
        (statusFilter === "inactive" && !cat.isActive);

      const matchesTag = tagFilter === "all" || cat.tag === tagFilter;

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [categories, searchTerm, statusFilter, tagFilter]);

  // Filtered items (based on selected category, search, status filter)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      const matchesCategory =
        !selectedCategoryId ||
        item.categoryId === selectedCategoryId ||
        (selectedCategoryName &&
          item.category.toLowerCase() === selectedCategoryName.toLowerCase());

      // Search term filter
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status === "Active") ||
        (statusFilter === "inactive" && item.status === "Inactive");

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [items, selectedCategoryId, selectedCategoryName, searchTerm, statusFilter]);

  // Pagination for items table
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  // Handlers with toast/snackbar notifications
  const handleToggleCategoryStatus = async (id: string) => {
    const cat = categories.find((c) => c.id === id || c.documentId === id);
    const newStatus = cat ? !cat.isActive : true;
    toggleCategoryStatus(id);

    if (cat?.documentId) {
      try {
        await serviceApi.updateCategory(cat.documentId, { isActive: newStatus });
      } catch (e) {
        console.warn("Failed to sync category status with API", e);
      }
    }

    showSnackbar({
      message: `Category "${cat?.name || "Service"}" is now ${newStatus ? "Active" : "Inactive"}`,
      type: "success",
    });
  };

  const handleToggleItemStatus = async (id: string) => {
    const item = items.find((i) => i.id === id || i.documentId === id);
    const newStatus = item?.status === "Active" ? "Inactive" : "Active";
    toggleItemStatus(id);

    if (item?.documentId) {
      try {
        await serviceApi.updateItem(item.documentId, {
          isActive: newStatus === "Active",
        });
      } catch (e) {
        console.warn("Failed to sync item status with API", e);
      }
    }

    showSnackbar({
      message: `Item "${item?.name || "Item"}" set to ${newStatus}`,
      type: "success",
    });
  };

  const handleToggleExpressDelivery = async (id: string) => {
    const item = items.find((i) => i.id === id || i.documentId === id);
    const newExpress = !item?.expressDeliveryAvailable;
    toggleItemExpressDelivery(id);

    if (item?.documentId) {
      try {
        await serviceApi.updateItem(item.documentId, {
          expressDeliveryAvailable: newExpress,
        });
      } catch (e) {
        console.warn("Failed to sync express status with API", e);
      }
    }

    showSnackbar({
      message: `Express Delivery ${newExpress ? "enabled" : "disabled"} for "${item?.name}"`,
      type: "info",
    });
  };

  const handleSaveItem = async (payload: {
    id?: string;
    documentId?: string;
    name: string;
    category: string;
    categoryId: string;
    normalPrice: number;
    offerPrice?: number | null;
    expressPrice?: number | null;
    expressDeliveryAvailable: boolean;
    status: "Active" | "Inactive";
    description?: string;
  }) => {
    try {
      if (payload.id || payload.documentId) {
        // Edit existing
        const targetId = payload.id || payload.documentId!;
        updateItem(targetId, payload);
        if (payload.documentId) {
          await serviceApi.updateItem(payload.documentId, {
            name: payload.name,
            price: payload.normalPrice,
            offerPrice: payload.offerPrice,
            expressDeliveryPrice: payload.expressPrice,
            expressDeliveryAvailable: payload.expressDeliveryAvailable,
            isActive: payload.status === "Active",
          });
        }
        showSnackbar({ message: `Updated item "${payload.name}" successfully`, type: "success" });
      } else {
        // Create new
        const created = addItem({
          name: payload.name,
          category: payload.category,
          categoryId: payload.categoryId,
          normalPrice: payload.normalPrice,
          offerPrice: payload.offerPrice,
          expressPrice: payload.expressPrice,
          expressDeliveryAvailable: payload.expressDeliveryAvailable,
          status: payload.status,
          description: payload.description,
        });

        try {
          const apiPayload: ServiceItemPayload = {
            name: payload.name,
            service: payload.categoryId,
            price: payload.normalPrice,
            offerPrice: payload.offerPrice,
            expressDeliveryPrice: payload.expressPrice,
            expressDeliveryAvailable: payload.expressDeliveryAvailable,
            isActive: payload.status === "Active",
            description: payload.description,
          };
          await serviceApi.createItem(apiPayload);
        } catch (err) {
          console.warn("API sync fallback for add item", err);
        }

        showSnackbar({ message: `Added new item "${created.name}"`, type: "success" });
      }
    } catch (err: any) {
      showSnackbar({ message: err.message || "Failed to save item", type: "error" });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id || i.documentId === id);
    deleteItem(id);

    if (item?.documentId) {
      try {
        await serviceApi.deleteItem(item.documentId);
      } catch (e) {
        console.warn("Failed to delete item from API", e);
      }
    }

    showSnackbar({ message: `Deleted item "${item?.name || "Service Item"}"`, type: "error" });
  };

  const handleSaveCategory = async (payload: {
    id?: string;
    documentId?: string;
    name: string;
    description: string;
    tag: string;
    image: string;
    isActive: boolean;
  }) => {
    if (payload.id || payload.documentId) {
      const targetId = payload.id || payload.documentId!;
      updateCategory(targetId, payload);
      if (payload.documentId) {
        try {
          await serviceApi.updateCategory(payload.documentId, {
            name: payload.name,
            description: payload.description,
            tag: payload.tag,
            isActive: payload.isActive,
          });
        } catch (e) {
          console.warn("Failed to sync category update", e);
        }
      }
      showSnackbar({ message: `Updated category "${payload.name}"`, type: "success" });
    } else {
      const created = addCategory({
        name: payload.name,
        description: payload.description,
        tag: payload.tag,
        image: payload.image || "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=600",
        isActive: payload.isActive,
      });

      try {
        const catApiPayload: ServiceCategoryPayload = {
          name: payload.name,
          description: payload.description,
          tag: payload.tag,
          isActive: payload.isActive,
        };
        await serviceApi.createCategory(catApiPayload);
      } catch (e) {
        console.warn("Failed to sync new category", e);
      }

      showSnackbar({ message: `Added category "${created.name}"`, type: "success" });
    }
  };

  return {
    categories,
    items,
    selectedCategoryId,
    selectedCategoryName,
    activeCategory,
    viewMode,
    editingItem,
    editingCategory,
    isLoading,
    error,
    searchTerm,
    statusFilter,
    tagFilter,
    currentPage,
    itemsPerPage,
    filteredCategories,
    filteredItems,
    paginatedItems,
    totalPages,

    // Setters
    setSearchTerm,
    setStatusFilter,
    setTagFilter,
    setCurrentPage,
    setViewMode,
    selectCategory,
    setEditingItem,
    setEditingCategory,

    // Action handlers
    handleToggleCategoryStatus,
    handleToggleItemStatus,
    handleToggleExpressDelivery,
    handleSaveItem,
    handleDeleteItem,
    handleSaveCategory,
    deleteCategory,
  };
};

export default useServicesHook;
