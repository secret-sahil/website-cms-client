import { useMutation } from "@tanstack/react-query";
import { LoginInput, LoginResponse } from "@/types/auth";
import Auth from "@/api/auth";
import { ApiErrorResponse, ApiResponse } from "@/types/common";
import { useTokenStore } from "@/store";
import Notify from "@/lib/notification";

export const useLogin = () => {
  const setToken = useTokenStore((state) => state.setToken);

  return useMutation<ApiResponse<LoginResponse>, ApiErrorResponse, LoginInput>({
    mutationFn: Auth.login,
    onSuccess: (response) => {
      setToken(response.result.data.access_token);
      window.location.href = "/dashboard";
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useLogout = () => {
  const removeToken = useTokenStore((state) => state.removeToken);

  return useMutation<unknown, ApiErrorResponse, unknown>({
    mutationFn: Auth.logout,
    onSuccess: () => {
      removeToken();
      window.location.href = "/";
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
