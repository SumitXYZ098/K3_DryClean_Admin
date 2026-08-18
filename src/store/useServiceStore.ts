/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import serviceApi from "../api/serviceApi";

export interface ServiceCategory {
  id: string;
  documentId?: string;
  name: string;
  description: string;
  tag: "Apparel" | "Household" | "Specialty" | string;
  image: string;
  isActive: boolean;
  itemCount: number;
}

export interface ServiceItem {
  id: string;
  documentId?: string;
  name: string;
  category: string; // Category ID or Name
  categoryId: string;
  normalPrice: number;
  offerPrice?: number | null;
  expressPrice?: number | null;
  expressDeliveryAvailable: boolean;
  status: "Active" | "Inactive";
  description?: string;
}

export const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    id: "dry-cleaning",
    documentId: "cat-1",
    name: "Dry Cleaning",
    description: "Premium garment care",
    tag: "Apparel",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCq2-TUOf6cxgLewBa_wVowzIkvTpuO8drTVdi8TkzE-sQ0KjJNKagFAmh0KiS00jVbOG_5RM2jGkpZgGVjYLHqhp5O2GVCJpc8UIV614jRZzcr-okk4yyN1QveHTpKcPjlLIMc-cMF3FqWOKLl4d1LxSpNS_d5kxa7vsWdfGlrcWTUPk7Mpph5Zh4pzQE1PsQTW8ZLLYCXH2fcS6wUa01n3an75NNeZxdeX_xoG-8YxlGCARoSLY8R8A",
    isActive: true,
    itemCount: 12,
  },
  {
    id: "wash-fold",
    documentId: "cat-2",
    name: "Wash & Fold",
    description: "Everyday laundry service",
    tag: "Apparel",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCO1RMEngSGYAWmB6JP2dC0rF3-qIwRUrDRtFQ-0EVUqDdem-jj8yTZTSg5J3uMKBDkByvLRZS2RbvioRRCGcBiF6eoxwsMnusKur3EnGmNHAJu2qQphezZm5a8xesHHZKidQ6mL4Yuls9Ic5-g3hr-oS1X1x5Pz-2igubvL8ii-euEprmPotiT9Tjz_JnOke8vkyudZQI5UUlBUd06pOOjzRFiC2_3k2OmCYT9Z07qLmEMoKHgKR7HOw",
    isActive: true,
    itemCount: 8,
  },
  {
    id: "ironing",
    documentId: "cat-3",
    name: "Ironing",
    description: "Professional pressing",
    tag: "Apparel",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmZ3XZSzFQvymW0sXlZyU3gQ9zlJwTRuQ5S7ehaucFtkUOhXfgou_Q3jNxPifZoEVHzQD4gYsM1rGQw7U-Iw0yeOLDAjh_iCv1Fa5JMtVhrYInHm6fbxMn5pL51A_zfFawdQhdFkQEoRaHgCJcTKxPMKMWs54XAwIinOPmJQelAG0X_oHGiET13K97qPlIzN4An_YcVwdHkh9bngkkCRevMjiFpupziysRuYicFM32i9l06kfft3PyEg",
    isActive: true,
    itemCount: 5,
  },
  {
    id: "shoe-cleaning",
    documentId: "cat-4",
    name: "Shoe Cleaning",
    description: "Expert footwear restoration",
    tag: "Specialty",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAy7Y5uJqSbqaRsUXFSSXxHNzprjdMw-OIkBA2XcD6expvbU_ctrn1BOU7jcEcVIaMZJSdWkIg9gT93ykYlkJyxJAAKxOHNW-LStGJ7NLNNBQcXm0epusgd2S1XdM2ezYoBJe8Ahvl2gl5qYK_pv0TYcSUe0JzL-a_qdKQuR_AVlvLkQJxsXG_iv-ogsl0EYW_lnl2ZIbcWJU6nyH7JhB_vJgrbvddrMEsQkQEhHvCqd6uYe7j7jfEigw",
    isActive: false,
    itemCount: 3,
  },
  {
    id: "home-bedding",
    documentId: "cat-5",
    name: "Home & Bedding",
    description: "Duvets, sheets & more",
    tag: "Household",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb1tBISmkWnbrM9XRg52hIDgAMCC_fYzjHFb_Uh000VipjPSSORdMKSJiKY4J39EwigExhBQkWHEFBimCiaedGFz3lBlYWHMZCRLwV8LMUvZycjEOHyio-kmlfQHDk-kqMysg33217_2p2ONruIjZiG1UICXcOw7yqeeGEXO541cWUPBffkMN87Kz6S_tGEckvv9xiOx29uEc6QvKJ2V8EdQP-XHpLFxIcaUzdfJ1IhWN3ibwYZWO1tQ",
    isActive: true,
    itemCount: 15,
  },
];

export const DEFAULT_ITEMS: ServiceItem[] = [
  {
    id: "item-1",
    documentId: "doc-1",
    name: "Suit - 2pc",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 18.0,
    offerPrice: null,
    expressPrice: 25.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description:
      "2-piece wool or cotton blend suit dry cleaned and hand finished.",
  },
  {
    id: "item-2",
    documentId: "doc-2",
    name: "Shirt",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 6.5,
    offerPrice: 5.0,
    expressPrice: 10.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Business or casual dress shirt pressed and hung.",
  },
  {
    id: "item-3",
    documentId: "doc-3",
    name: "Dress",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 15.0,
    offerPrice: null,
    expressPrice: null,
    expressDeliveryAvailable: false,
    status: "Inactive",
    description: "Formal or evening dress requiring gentle solvent cleaning.",
  },
  {
    id: "item-4",
    documentId: "doc-4",
    name: "Pants",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 8.0,
    offerPrice: null,
    expressPrice: 12.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Trousers or slacks pressed with crisp center crease.",
  },
  {
    id: "item-5",
    documentId: "doc-5",
    name: "Silk Saree / Heavy Dress",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 22.0,
    offerPrice: 19.99,
    expressPrice: 30.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description:
      "Delicate silk embroidery garment handled with eco-friendly cleaning.",
  },
  {
    id: "item-6",
    documentId: "doc-6",
    name: "Winter Coat",
    category: "Dry Cleaning",
    categoryId: "dry-cleaning",
    normalPrice: 28.0,
    offerPrice: 24.5,
    expressPrice: 38.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Heavy wool, down or trench coat deep dry cleaned.",
  },

  // Wash & Fold Items
  {
    id: "item-7",
    documentId: "doc-7",
    name: "Standard Wash & Fold (per kg)",
    category: "Wash & Fold",
    categoryId: "wash-fold",
    normalPrice: 4.5,
    offerPrice: 3.99,
    expressPrice: 7.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Everyday clothes washed, tumble dried, and neatly folded.",
  },
  {
    id: "item-8",
    documentId: "doc-8",
    name: "Bed Linen Set",
    category: "Wash & Fold",
    categoryId: "wash-fold",
    normalPrice: 16.0,
    offerPrice: null,
    expressPrice: 22.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Sheets, pillowcases and duvet cover washed & folded.",
  },

  // Ironing Items
  {
    id: "item-9",
    documentId: "doc-9",
    name: "Formal Shirt Press",
    category: "Ironing",
    categoryId: "ironing",
    normalPrice: 3.5,
    offerPrice: null,
    expressPrice: 5.5,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Steam pressing for dress shirts.",
  },
  {
    id: "item-10",
    documentId: "doc-10",
    name: "Trouser Press",
    category: "Ironing",
    categoryId: "ironing",
    normalPrice: 4.0,
    offerPrice: 3.0,
    expressPrice: 6.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Sharp crease pressing for formal trousers.",
  },

  // Shoe Cleaning
  {
    id: "item-11",
    documentId: "doc-11",
    name: "Sports Sneakers Deep Clean",
    category: "Shoe Cleaning",
    categoryId: "shoe-cleaning",
    normalPrice: 18.0,
    offerPrice: 15.0,
    expressPrice: 24.0,
    expressDeliveryAvailable: false,
    status: "Inactive",
    description: "Complete sole scrubbing, mesh wash, and deodorizing.",
  },

  // Home & Bedding
  {
    id: "item-12",
    documentId: "doc-12",
    name: "King Size Duvet",
    category: "Home & Bedding",
    categoryId: "home-bedding",
    normalPrice: 32.0,
    offerPrice: 28.0,
    expressPrice: 45.0,
    expressDeliveryAvailable: true,
    status: "Active",
    description: "Sanitized deep wash and anti-allergen drying.",
  },
];

interface ServiceStoreState {
  categories: ServiceCategory[];
  items: ServiceItem[];
  selectedCategoryId: string | null;
  selectedCategoryName: string | null;
  viewMode: "categories" | "items" | "add-item" | "edit-item";
  editingItem: ServiceItem | null;
  editingCategory: ServiceCategory | null;
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;

  // Actions
  setViewMode: (
    mode: "categories" | "items" | "add-item" | "edit-item",
  ) => void;
  selectCategory: (
    categoryId: string | null,
    categoryName?: string | null,
  ) => void;
  toggleCategoryStatus: (id: string) => void;
  toggleItemStatus: (id: string) => void;
  toggleItemExpressDelivery: (id: string) => void;
  addItem: (itemPayload: Omit<ServiceItem, "id">) => ServiceItem;
  updateItem: (id: string, itemPayload: Partial<ServiceItem>) => void;
  deleteItem: (id: string) => void;
  addCategory: (
    catPayload: Omit<ServiceCategory, "id" | "itemCount">,
  ) => ServiceCategory;
  updateCategory: (id: string, catPayload: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;
  setEditingItem: (item: ServiceItem | null) => void;
  setEditingCategory: (category: ServiceCategory | null) => void;
  fetchServicesAndItems: (force?: boolean) => Promise<void>;
}

export const useServiceStore = create<ServiceStoreState>((set, get) => ({
  categories: [],
  items: [],
  selectedCategoryId: null,
  selectedCategoryName: null,
  viewMode: "categories",
  editingItem: null,
  editingCategory: null,
  isLoading: true,
  hasFetched: false,
  error: null,

  setViewMode: (viewMode) => set({ viewMode }),

  selectCategory: (categoryId, categoryName) => {
    let catName = categoryName;
    if (categoryId && !catName) {
      const cat = get().categories.find(
        (c) => c.id === categoryId || c.documentId === categoryId,
      );
      catName = cat ? cat.name : null;
    }
    set({
      selectedCategoryId: categoryId,
      selectedCategoryName: catName || null,
      viewMode: categoryId ? "items" : "categories",
    });
  },

  toggleCategoryStatus: (id) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id || c.documentId === id
          ? { ...c, isActive: !c.isActive }
          : c,
      ),
    })),

  toggleItemStatus: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id || i.documentId === id
          ? { ...i, status: i.status === "Active" ? "Inactive" : "Active" }
          : i,
      ),
    })),

  toggleItemExpressDelivery: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id || i.documentId === id
          ? { ...i, expressDeliveryAvailable: !i.expressDeliveryAvailable }
          : i,
      ),
    })),

  addItem: (itemPayload) => {
    const newId = `item-${Date.now()}`;
    const newItem: ServiceItem = {
      ...itemPayload,
      id: newId,
    };

    set((state) => {
      const updatedItems = [newItem, ...state.items];
      // update category item count
      const updatedCategories = state.categories.map((c) =>
        c.id === itemPayload.categoryId ||
        c.name.toLowerCase() === itemPayload.category.toLowerCase()
          ? { ...c, itemCount: (c.itemCount || 0) + 1 }
          : c,
      );

      return {
        items: updatedItems,
        categories: updatedCategories,
      };
    });

    return newItem;
  },

  updateItem: (id, itemPayload) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id || i.documentId === id ? { ...i, ...itemPayload } : i,
      ),
    }));
  },

  deleteItem: (id) => {
    set((state) => {
      const targetItem = state.items.find(
        (i) => i.id === id || i.documentId === id,
      );
      const updatedItems = state.items.filter(
        (i) => i.id !== id && i.documentId !== id,
      );

      let updatedCategories = state.categories;
      if (targetItem) {
        updatedCategories = state.categories.map((c) =>
          c.id === targetItem.categoryId ||
          c.name.toLowerCase() === targetItem.category.toLowerCase()
            ? { ...c, itemCount: Math.max(0, (c.itemCount || 1) - 1) }
            : c,
        );
      }

      return {
        items: updatedItems,
        categories: updatedCategories,
      };
    });
  },

  addCategory: (catPayload) => {
    const newId = `cat-${Date.now()}`;
    const newCat: ServiceCategory = {
      ...catPayload,
      id: newId,
      itemCount: 0,
    };
    set((state) => ({
      categories: [newCat, ...state.categories],
    }));
    return newCat;
  },

  updateCategory: (id, catPayload) => {
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id || c.documentId === id ? { ...c, ...catPayload } : c,
      ),
    }));
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(
        (c) => c.id !== id && c.documentId !== id,
      ),
    }));
  },

  setEditingItem: (editingItem) => set({ editingItem }),
  setEditingCategory: (editingCategory) => set({ editingCategory }),

  fetchServicesAndItems: async (force = false) => {
    if (get().hasFetched && !force && get().categories.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const res = await serviceApi.getServicesWithVariants();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const categoriesMap: ServiceCategory[] = [];
        const itemsMap: ServiceItem[] = [];

        res.data.forEach((srv: any, idx: number) => {
          const categoryId = srv.documentId || `cat-${idx + 1}`;
          const catName = srv.name
            ? srv.name.charAt(0).toUpperCase() + srv.name.slice(1)
            : `Category ${idx + 1}`;

          const rawVariants = srv.varients || srv.variants || [];

          categoriesMap.push({
            id: categoryId,
            documentId: srv.documentId,
            name: catName,
            description: srv.description || "Professional care service",
            tag: srv.tag || "Apparel",
            image: srv.image?.url
              ? srv.image.url
              : DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length].image,
            isActive: srv.isActive !== false,
            itemCount: rawVariants.length,
          });

          rawVariants.forEach((v: any, vIdx: number) => {
            itemsMap.push({
              id: v.documentId || `item-${idx}-${vIdx}`,
              documentId: v.documentId,
              name: v.name
                ? v.name.charAt(0).toUpperCase() + v.name.slice(1)
                : "Garment Item",
              category: catName,
              categoryId: categoryId,
              normalPrice: v.pricing?.price || v.price || 10,
              offerPrice: v.pricing?.offerPrice ?? v.offerPrice ?? null,
              expressPrice:
                v.pricing?.expressDeliveryPrice ??
                v.expressDeliveryPrice ??
                null,
              expressDeliveryAvailable: v.expressDeliveryAvailable !== false,
              status: v.isActive === false ? "Inactive" : "Active",
              description: v.description || "",
            });
          });
        });

        if (categoriesMap.length > 0) {
          set({
            categories: categoriesMap,
            items: itemsMap,
            hasFetched: true,
            isLoading: false,
          });
          return;
        }
      }

      // If backend returns empty array or unauthenticated, fall back to default template categories
      set({
        categories: DEFAULT_CATEGORIES,
        items: DEFAULT_ITEMS,
        hasFetched: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn(
        "Failed to fetch services from API, using default catalog",
        err,
      );
      set({
        categories: DEFAULT_CATEGORIES,
        items: DEFAULT_ITEMS,
        hasFetched: true,
        isLoading: false,
      });
    }
  },
}));

export default useServiceStore;
