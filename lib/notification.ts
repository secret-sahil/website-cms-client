import toast from "react-hot-toast";

export default class Notify {
  static async error(message: string | Array<Error>) {
    toast.error(
      typeof message === "object" ? message.map((err: Error) => err.message).join(", ") : message
    );
  }
  static async success(message: string) {
    toast.success(message);
  }
}
