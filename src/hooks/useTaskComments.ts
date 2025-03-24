import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTaskComments,
  getTaskCommentsByTaskId,
  createTaskComments,
  deleteTaskComments,
} from "../api/task-comments";
import { TaskComments } from "../api/types";

export const useTaskComments = () => {
  return useQuery({
    queryKey: ["taskComments"],
    queryFn: getTaskComments,
  });
};
export const useTaskCommentsByTaskId = (taskId: number) => {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: () => getTaskCommentsByTaskId(taskId),
    enabled: !!taskId, 
  });
};
export const useCreateTaskComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newComment: TaskComments) => createTaskComments(newComment),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["taskComments", taskId] }); 
    },
  });
};
export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTaskComments(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["taskComments"] }); 
    },
  });
};
