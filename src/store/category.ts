import { create } from "zustand";
import { CategoryStore } from "../api/types";
import { getCategories } from "../api/categories";

export const useCategoryStore = create<CategoryStore>()((set) => ({
  categories: [],
  getCategories: async () => {
    const categories = await getCategories();
    return set((state) => ({ ...state, categories }));
  },
}));
