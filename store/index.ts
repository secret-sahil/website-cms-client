import { TokenStore } from "@/types/token";
import { create } from "zustand";
import Cookies from "js-cookie";

export const useTokenStore = create<TokenStore>()((set) => ({
  token: Cookies.get("token") || "",
  setToken: (token) => {
    Cookies.set("token", token, { expires: 7 });
    set({ token });
  },
  removeToken: () => {
    Cookies.remove("token");
    set({ token: "" });
  },
}));
