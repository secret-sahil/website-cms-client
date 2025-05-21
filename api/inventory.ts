import api from "./axiosInstance";

export default class Items {
  static async read(): Promise<any> {
    return await api.get("/api/v1/inventory");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/inventory/${id}`);
  }

  static async getBatchesForItemWithSelectedQuantity(data: any): Promise<any> {
    return await api.get(`/api/v1/inventory/batches-for-item-with-selected-quantity/${data.id}`, {
      params: data,
    });
  }
}
