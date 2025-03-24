import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLables, getLabels } from "../api/labels";
import { toast } from "react-toastify";

export const useLabels = () => {
  return useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });
};
export const useDeleteLabel = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (labelId: number) => deleteLables(labelId),
      onSuccess: () => {
        toast.success("Label deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["labels"] });
      },
      onError: () => {
        toast.error("Failed to delete label.");
      },
    });
  };