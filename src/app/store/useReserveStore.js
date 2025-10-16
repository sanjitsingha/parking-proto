import { create } from "zustand";

export const useReserveStore = create((set) => ({
  reserveDetails: null,
  setReserveDetails: (data) => set({ reserveDetails: data }),
  clearReserveDetails: () => set({ reserveDetails: null }),
}));
