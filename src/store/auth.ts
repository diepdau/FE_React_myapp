import { create } from "zustand";
import { IUser } from "../api/types";
import { getAuthUser, logoutUserFn } from "../api/users";
type Store = {
  authUser: IUser | null;
  token: string | null;
  requestLoading: boolean;
  setAuthUser: (user: IUser | null, token?: string | null) => void;
  logoutUser: () => void;
  setRequestLoading: (isLoading: boolean) => void;
  loginSuccess: boolean;
};
const useStore = create<Store>((set) => {
  const token = localStorage.getItem("AccessToken");
  let authUser: any | null = null;
  setTimeout(() => {
    if (token) {
      authUser = getAuthUser();
    }
  }, 300);
  return {
    authUser,
    token,
    requestLoading: false,
    loginSuccess: false,
    setAuthUser: (user, token) => {
      if (token) {
        localStorage.setItem("AccessToken", token);
      }
      set((state) => ({
        ...state,
        authUser: user,
        token: token,
        loginSuccess: true,
      }));
    },
    logoutUser: async () => {
      try {
        await logoutUserFn();
        localStorage.removeItem("AccessToken");
      } catch (error) {
        console.error("Error logging out:", error);
      }
      set(() => ({
        authUser: null,
        token: null,
      }));
    },
    setRequestLoading: (isLoading) =>
      set((state) => ({ ...state, requestLoading: isLoading })),
  };
});
export default useStore;
