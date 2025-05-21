import api from "./axiosInstance";

export default class Sales {
  static async create(data: any): Promise<any> {
    return await api.post("/api/v1/material-issues/create", data);
  }

  static async createIndependent(data: any): Promise<any> {
    return await api.post("/api/v1/material-issues/create-independent", data);
  }

  static async update(data: any): Promise<any> {
    return await api.patch(`/api/v1/material-issues/update/${data.id}`, data);
  }

  static async return(data: any): Promise<any> {
    return await api.post("/api/v1/material-issues/return", data);
  }

  static async read(): Promise<any> {
    return await api.get("/api/v1/material-issues");
  }

  static async readOne(id: any): Promise<any> {
    return await api.get(`/api/v1/material-issues/${id}`);
  }

  static async delieveredQuantity(id: any): Promise<any> {
    return await api.get(`/api/v1/material-issues/material-issued-quantity/${id}`);
  }
}
