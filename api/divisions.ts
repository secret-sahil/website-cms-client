import api from "./axiosInstance";

export default class Divisions {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/divisions/create", data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/divisions");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/divisions/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/divisions/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/divisions/delete/${id}`);
  }
}
