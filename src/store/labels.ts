import { create } from "zustand";
import { LabelsStore } from "../api/types";
import { getLabels } from "../api/labels";

export const useLabelsStore = create<LabelsStore>()((set) => ({
  labels: [],
  getLabels: async () => {
    const labels = await getLabels();
    return set((state) => ({ ...state, labels }));
  },
}));
