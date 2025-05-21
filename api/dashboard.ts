import api from "./axiosInstance";

export default class Dashboard {
  static async getDashboardData(): Promise<any> {
    return await api.get("/api/v1/dashboard");
  }
}
