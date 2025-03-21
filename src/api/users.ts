import { apiClient } from "./apibase";

export async function logoutUserFn() {
  const response = await apiClient.post(`auth/logout`);
  return response.data;
}
export async function getAuthUser() {
  const response = await apiClient.get(`/users/me`);
  return response.data;
}
