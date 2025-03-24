import axios from "axios";
import { LoginInput } from "../pages/Auth/Login";
import { RegisterInput } from "../pages/Auth/Register";

const BASE_URL = "https://localhost:7001/api/";
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post("auth/login", user);
  return response.data;
};
export const RegisterUserFn = async (user: RegisterInput) => {
  const response = await authApi.post("auth/register", user);
  return response.data;
};
