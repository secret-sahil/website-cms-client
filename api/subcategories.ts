import api from "./axiosInstance";

export default class SubCategories {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/subcategories/create", data);
  }

  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/subcategories", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/subcategories/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/subcategories/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/subcategories/delete/${id}`);
  }
}
