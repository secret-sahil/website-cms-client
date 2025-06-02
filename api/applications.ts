import api from "./axiosInstance";

export default class Applications {
  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/applications", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/applications/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/applications/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/applications/delete/${id}`);
  }
}
