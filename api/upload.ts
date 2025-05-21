import api from "./axiosInstance";

export default class Upload {
  static async image(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    return await api.post("/api/v1/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
