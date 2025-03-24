import { apiClient } from "./apibase";

export async function logoutUserFn() {
  const response = await apiClient.post(`auth/logout`);
  return response.data;
}
export async function getAuthUser() {
  try {
    const response = await apiClient.get(`/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error authenticated user:", error);
    throw error; 
  }
}

