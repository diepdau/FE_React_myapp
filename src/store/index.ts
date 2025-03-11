import {create} from 'zustand';
import { IUser } from '../api/types';

type Store = {
  authUser: IUser | null;
  token: string | null; 
  requestLoading: boolean;
  setAuthUser: (user: IUser | null, token?: string | null) => void;
  logoutUser: () => void;
  setRequestLoading: (isLoading: boolean) => void;
};
const useStore = create<Store>((set) => ({
  authUser: null,
  token: null,
  requestLoading: false,
  setAuthUser: (user, token) =>
    set((state) => ({
      ...state,
      authUser: user,
      token: token || null,
    })),
  logoutUser: () =>
    set(() => ({
      authUser: null,
      token: null,
    })),
  setRequestLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
}));

export default useStore;
