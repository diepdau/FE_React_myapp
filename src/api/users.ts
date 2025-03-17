import { apiClient } from "./apibase";

export async function logoutUserFn() {
  const response = await apiClient.post(`auth/logout`);
  return response.data;
}
