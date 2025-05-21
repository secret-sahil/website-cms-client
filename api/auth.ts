import { useTokenStore } from "@/store";
import api from "./axiosInstance";
import { ApiResponse } from "@/types/common";
import { RefreshResponse } from "@/types/auth";

export default class Auth {
  static async login(data: any): Promise<any> {
    return await api.post("/api/v1/auth/login", data);
  }

  static async refresh(): Promise<any> {
    const response: any = await api.post<ApiResponse<RefreshResponse>>("/api/v1/auth/refresh");
    useTokenStore.getState().setToken(response.result.data.access_token);
  }

  static async logout(): Promise<any> {
    return await api.post("/api/v1/auth/logout");
  }
}
