import api from "./axiosInstance";

export default class Storages {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/storages/create", data);
  }

  static async read(data?: any): Promise<any> {
    return await api.get("/api/v1/storages", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/storages/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/storages/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/storages/delete/${id}`);
  }
}
