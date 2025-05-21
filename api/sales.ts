import api from "./axiosInstance";

export default class Sales {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/sales/create", data);
  }

  static async createIndependent(data: any): Promise<any> {
    return await api.post("/api/v1/sales/create-independent", data);
  }

  static async return(data: any): Promise<any> {
    return await api.post("/api/v1/sales/return", data);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/sales/update/${data.id}`, data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/sales");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/sales/${id}`);
  }

  static async delieveredQuantity(id: any): Promise<any> {
    return await api.get(`/api/v1/sales/delievered-quantity/${id}`);
  }
}
