import api from "./axiosInstance";

export default class Boms {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/boms/create", data);
  }

  static async read(data?: any): Promise<any> {
    return await api.get("/api/v1/boms", {
      params: data,
    });
  }

  static async readOne(id: any, itemId: any): Promise<any> {
    return await api.get(`/api/v1/boms/${id}`, {
      params: {
        itemId,
      },
    });
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/boms/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/boms/delete/${id}`);
  }
}
