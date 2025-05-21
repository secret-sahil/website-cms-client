import api from "./axiosInstance";

export default class Prodcuts {
  static async getProdcuts(data: any): Promise<any> {
    return await api.get("/api/v1/product/get-products-admin", { params: data });
  }
}
