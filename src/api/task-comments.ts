import { TaskComments } from "./types";
import { apiClient } from "./apibase";

export async function getTaskComments(): Promise<Array<TaskComments>> {
  const response = await apiClient.get("task-comments");
  return response.data;
}
export async function getTaskCommentsByTaskId(
  id: number
): Promise<Array<TaskComments>> {
  const response = await apiClient.get(`task-comments/task/${id}`);
  return response.data;
}
export async function createTaskComments(
  taskComments: TaskComments
): Promise<Array<TaskComments>> {
  const response = await apiClient.post("task-comments", taskComments);
  return response.data;
}
export async function deleteTaskComments(
  id: any
): Promise<Array<TaskComments>> {
  const response = await apiClient.delete(`task-comments/${id}`);
  return response.data;
}
