import api from "./axiosInstance";

export default class User {
  static async getAllUsers(): Promise<any> {
    return await api.get("/api/v1/user");
  }

  static async getUser(): Promise<any> {
    return await api.get("/api/v1/users/me");
  }
}
