import {create} from 'zustand';
import { IUser } from '../api/types';
import { getAuthUser, logoutUserFn  } from "../api/users";
import Cookies from "js-cookie";
type Store = {
  authUser: IUser | null;
  token: string | null; 
  requestLoading: boolean;
  setAuthUser: (user: IUser | null, token?: string | null) => void;
  logoutUser: () => void;
  checkAuth: () => Promise<void>;
  setRequestLoading: (isLoading: boolean) => void;
};
const useStore = create<Store>((set) => ({
  authUser: null,
  token: Cookies.get("AccessToken") || localStorage.getItem("AccessToken") || null,
  requestLoading: false,
  setAuthUser: (user, token) => {
    if (token) {
      localStorage.setItem("AccessToken", token);
      Cookies.set("AccessToken", token, { expires: 7 });
    }
    set((state) => ({
      ...state,
      authUser: user,
      token: token || state.token,
    }));
  },
  logoutUser: async () => {
    try {
      await logoutUserFn();
    } catch (error) {
      console.error("Error logging out:", error);
    }
    localStorage.removeItem("AccessToken");
    Cookies.remove("AccessToken");
    set(() => ({
      authUser: null,
      token: null,
    }));
  },
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
  checkAuth: async () => {
    const token = Cookies.get("AccessToken") || localStorage.getItem("AccessToken");
    if (token) {
      try {
        const user = await getAuthUser();
        set((state) => ({
          ...state,
          authUser: user,
          token,
        }));
      } catch (error) {
        console.error("Token expired or invalid:", error);
        localStorage.removeItem("AccessToken");
        Cookies.remove("AccessToken");
      }
    }
  },
}));

export default useStore;
