import api from "./axiosInstance";

export default class UnitConversions {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/units-conversions/create", data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/units-conversions");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/units-conversions/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/units-conversions/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/units-conversions/delete/${id}`);
  }
}
