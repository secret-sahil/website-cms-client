import api from "./axiosInstance";

export default class Production {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/production/create", data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/production");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/production/${id}`);
  }
}
