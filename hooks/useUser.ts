import { useQuery } from "@tanstack/react-query";
import { UsersResponse } from "@/types/user";
import { ApiErrorResponse, ApiResponse } from "@/types/common";
import User from "@/api/user";

export const useGetAllUsers = () => {
  return useQuery<ApiResponse<UsersResponse[]>, ApiErrorResponse>({
    queryFn: () => User.getAllUsers(),
    queryKey: ["users"],
  });
};

export const useGetUser = () => {
  return useQuery<ApiResponse<UsersResponse>, ApiErrorResponse>({
    queryFn: () => User.getUser(),
    queryKey: ["user"],
  });
};
