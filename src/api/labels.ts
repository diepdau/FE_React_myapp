import {  Label } from "./types";
import { apiClient } from "./apibase";
export async function getLabels(): Promise<Array<Label>> {
  const response = await apiClient.get("labels");
  return response.data;
}
