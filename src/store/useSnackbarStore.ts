import { create } from "zustand";

export type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
  showSnackbar: (options: {
    message: string;
    type?: SnackbarType;
    duration?: number;
  }) => void;
  hideSnackbar: () => void;
}

let timerId: ReturnType<typeof setTimeout> | null = null;

export const useSnackbarStore = create<SnackbarState>((set) => ({
  isOpen: false,
  message: "",
  type: "info",
  duration: 4000,
  showSnackbar: ({ message, type = "info", duration = 4000 }) => {
    if (timerId) clearTimeout(timerId);

    set({
      isOpen: true,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      timerId = setTimeout(() => {
        set({ isOpen: false });
      }, duration);
    }
  },
  hideSnackbar: () => {
    if (timerId) clearTimeout(timerId);
    set({ isOpen: false });
  },
}));

export default useSnackbarStore;
