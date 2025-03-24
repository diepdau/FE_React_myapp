import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getTaskById, createTasks, updateTasks, deleteTasks } from "../api/task";
import { Task, TaskCreate } from "../api/types";
import { toast } from "react-toastify";
export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};

export const useTaskById = (id: number) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id, 
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTask: TaskCreate) => createTasks(newTask),
    onSuccess: () => {
        toast.success("Task created successfully!"); 
        queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      },
      onError: (error: any) => {
        console.error("Create task error:", error);
        toast.error(error?.response?.data?.message || "Failed to create task."); 
      },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedTask: Task) => updateTasks(updatedTask, updatedTask.id),
    onSuccess: () => {
        toast.success("Task updated successfully!"); 
        queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      },
      onError: (error: any) => {
        console.error("Update task error:", error);
        toast.error(error?.response?.data?.message || "Failed to update task."); 
      },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTasks(id),
    onSuccess: () => {
        toast.success("Task deleted successfully!"); 
        queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      },
      onError: (error: any) => {
        console.error("Delete task error:", error);
        toast.error(error?.response?.data?.message || "Failed to delete task.");
      },
  });
};
