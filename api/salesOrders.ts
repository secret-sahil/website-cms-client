import api from "./axiosInstance";

export default class SalesOrders {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/salesorders/create", data);
  }

  static async read(data?: any): Promise<any> {
    return await api.get("/api/v1/salesorders", {
      params: data,
    });
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/salesorders/${id}`);
  }

  static async readRequiredSalesItems(id: any): Promise<any> {
    return await api.get(`/api/v1/salesorders/sales-order-required-items/${id}`);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/salesorders/update/${data.id}`, data);
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/salesorders/delete/${id}`);
  }
}
