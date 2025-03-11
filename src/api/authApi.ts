import axios from 'axios';
import { LoginInput } from '../pages/login';
import { RegisterInput } from '../pages/register';
const BASE_URL = "https://localhost:7001/api/";
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post("auth/login", user);
  return response.data;
};
export const RegisterUserFn = async (user: RegisterInput) => {
  const response = await authApi.post("auth/register", user);
  return response.data;
};
export const logoutUserFn = async (token:any) => {
    const response = await axios.post(
      "https://localhost:7001/api/auth/logout",{},
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, 
        },
        withCredentials: true,
      }
    ); 
    return response.data;
};
