import api from "./axiosInstance";

export default class Job {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/careers/create", data);
  }

  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/careers", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/careers/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/careers/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/careers/delete/${id}`);
  }
}
