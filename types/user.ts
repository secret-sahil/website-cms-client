export interface UsersResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: "sales" | "content" | "hr" | "admin";
  photo?: string;
  mobile?: string;
  createdAt: string;
  updatedAt: string;
}
