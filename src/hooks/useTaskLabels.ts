import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaskLabels,
  createTaskLabels,
  deleteTaskLabels,
  getTaskLabelsByTaskId,
} from "../api/task-labels";
import { toast } from "react-toastify";

export const useTaskLabels = () => {
  return useQuery({
    queryKey: ["taskLabels"],
    queryFn: getTaskLabels,
  });
};

export const useTaskLabelsByTaskId = (taskId: number) => {
  return useQuery({
    queryKey: ["taskLabels", taskId],
    queryFn: () => getTaskLabelsByTaskId(taskId),
    enabled: !!taskId,
  });
};

export const useCreateTaskLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskLabels,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
    },
  });
};

export const useDeleteTaskLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      labelId,
    }: {
      taskId: number;
      labelId: number;
    }) => {
      await deleteTaskLabels(taskId, labelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLabels"] });
    },
  });
};
