import api from "./axiosInstance";

export default class Lead {
  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/lead", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/lead/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/lead/update/${data.id}`, data);
  }
}
