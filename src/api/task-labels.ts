import { TaskLabels } from "./types";
import { apiClient } from "./apibase";

export async function getTaskLabels(): Promise<Array<TaskLabels>> {
  const response = await apiClient.get("task-labels");
  return response.data;
}
export async function getTaskLabelsByTaskId(
  id: number
): Promise<Array<TaskLabels>> {
  const response = await apiClient.get(`task-labels/task/${id}`);
  return response.data;
}
export async function createTaskLabels(
  taskLabels: TaskLabels
): Promise<Array<TaskLabels>> {
  const response = await apiClient.post("task-labels", taskLabels);
  return response.data;
}
export async function deleteTaskLabels(
  taskId: any,
  labelId: any
): Promise<Array<TaskLabels>> {
  const response = await apiClient.delete(`task-labels/${taskId}/${labelId}`);
  return response.data;
}
