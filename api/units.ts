import api from "./axiosInstance";

export default class Units {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/units/create", data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/units");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/units/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/units/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/units/delete/${id}`);
  }
}
