import { create } from "zustand";

export const useParkingStore = create((set) => ({
  selectedLot: null,
  setSelectedLot: (lot) => set({ selectedLot: lot }),
}));
