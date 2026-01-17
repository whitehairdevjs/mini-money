import apiClient from "./api";
import { AuthResponse } from "./auth";
import { authStorage } from "./auth";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    if (response.data.token) {
      authStorage.setToken(response.data.token);
      authStorage.setUser({
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
      });
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    if (response.data.token) {
      authStorage.setToken(response.data.token);
      authStorage.setUser({
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
      });
    }
    return response.data;
  },

  logout: (): void => {
    authStorage.removeToken();
  },
};





