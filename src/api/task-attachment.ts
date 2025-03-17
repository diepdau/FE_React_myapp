import { TaskAttachments } from "./types";
import { apiClient } from "./apibase";

export async function getTaskAttachmentsByTaskId(
  id: number
): Promise<Array<TaskAttachments>> {
  const response = await apiClient.get(`task-attachments/${id}`);
  return response.data;
}
export async function createTaskAttachments(
  id: number,
  files: File[]
): Promise<Array<TaskAttachments>> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  const response = await apiClient.post(`task-attachments/${id}`, formData);
  return response.data;
}

export async function deleteTaskAttachments(
  id: any
): Promise<Array<TaskAttachments>> {
  const response = await apiClient.delete(`task-attachments/${id}`);
  return response.data;
}
