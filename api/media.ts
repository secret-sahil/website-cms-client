import api from "./axiosInstance";

export default class Media {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/media/upload", data);
  }

  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/media", {
      params: data,
    });
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/media/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/media/delete/${id}`);
  }
}
