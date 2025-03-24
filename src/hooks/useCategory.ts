import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
