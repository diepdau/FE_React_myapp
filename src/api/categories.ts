import { Category } from "./types";
import { apiClient } from "./apibase";
export async function getCategories(): Promise<Array<Category>> {
  const response = await apiClient.get("categories");
  return response.data;
}
