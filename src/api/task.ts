import { Task, TaskCreate } from "./types";
import { apiClient } from "./apibase";
export async function getTasks(): Promise<Array<Task>> {
  const response = await apiClient.get("tasks");
  return response.data;
}
export async function getTaskById(id: number): Promise<Task> {
  const response = await apiClient.get(`tasks/${id}`);
  return response.data;
} 
export async function createTasks(
  task: TaskCreate
): Promise<Array<Task>> {
  const response = await apiClient.post("tasks", task);
  return response.data;
}
export async function updateTasks(task: Task, id: any): Promise<Array<Task>> {
  const response = await apiClient.put(`tasks/${id}`, task);
  return response.data;
}
export async function deleteTasks(id: any): Promise<Array<Task>> {
  const response = await apiClient.delete(`tasks/${id}`);
  return response.data;
}
