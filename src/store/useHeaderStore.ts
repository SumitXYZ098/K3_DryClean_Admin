import { create } from "zustand";

interface HeaderState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customActionHandler: (() => void) | null;
  setCustomActionHandler: (handler: (() => void) | null) => void;
  triggerCustomAction: () => void;
}

export const useHeaderStore = create<HeaderState>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  customActionHandler: null,
  setCustomActionHandler: (handler) => set({ customActionHandler: handler }),
  triggerCustomAction: () => {
    const handler = get().customActionHandler;
    if (handler) {
      handler();
    }
  },
}));

export default useHeaderStore;
