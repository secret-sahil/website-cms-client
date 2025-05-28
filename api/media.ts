import api from "./axiosInstance";

export default class Media {
  static async create(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post("/api/v1/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async read(data: any): Promise<any> {
    return await api.get("/api/v1/media", {
      params: data,
    });
  }

  static async update(data: any): Promise<any> {
    const formData = new FormData();
    formData.append("file", data.file);
    return await api.patch(`/api/v1/media/update/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async delete(id: any): Promise<any> {
    return await api.delete(`/api/v1/media/delete/${id}`);
  }
}
