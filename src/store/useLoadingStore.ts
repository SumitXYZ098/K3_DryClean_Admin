import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  pendingRequests: number;
  message: string | null;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  startApiRequest: () => void;
  endApiRequest: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  pendingRequests: 0,
  message: null,
  showLoading: (message = "Loading...") =>
    set((state) => ({
      isLoading: true,
      pendingRequests: state.pendingRequests + 1,
      message,
    })),
  hideLoading: () =>
    set((state) => {
      const nextPending = Math.max(0, state.pendingRequests - 1);
      return {
        pendingRequests: nextPending,
        isLoading: nextPending > 0,
        message: nextPending > 0 ? state.message : null,
      };
    }),
  startApiRequest: () =>
    set((state) => ({
      pendingRequests: state.pendingRequests + 1,
      isLoading: true,
    })),
  endApiRequest: () =>
    set((state) => {
      const nextPending = Math.max(0, state.pendingRequests - 1);
      return {
        pendingRequests: nextPending,
        isLoading: nextPending > 0,
      };
    }),
}));

export default useLoadingStore;
