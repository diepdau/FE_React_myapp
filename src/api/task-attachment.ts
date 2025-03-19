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
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await apiClient.post(`task-attachments/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
export async function deleteTaskAttachments(
  id: any
): Promise<Array<TaskAttachments>> {
  const response = await apiClient.delete(`task-attachments/${id}`);
  return response.data;
}
export async function downloadFileTaskAttachments(
  nameFile: string
): Promise<void> {
  const response = await apiClient.get(
    `task-attachments/DownloadFile/${nameFile}`,
    {
      responseType: "blob",
    }
  );
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nameFile);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
