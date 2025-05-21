import api from "./axiosInstance";

export default class Parties {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/parties/create", data);
  }

  static async read(data?: any): Promise<any> {
    return await api.get("/api/v1/parties", { params: data });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/parties/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/parties/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/parties/delete/${id}`);
  }
}
