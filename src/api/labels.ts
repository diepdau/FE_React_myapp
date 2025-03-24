import {  Label } from "./types";
import { apiClient } from "./apibase";
export async function getLabels(): Promise<Array<Label>> {
  const response = await apiClient.get("labels");
  return response.data;
}
export async function deleteLables(id: any): Promise<Array<Label>> {
  const response = await apiClient.delete(`labels/${id}`);
  return response.data;
}
