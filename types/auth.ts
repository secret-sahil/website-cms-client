export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  loggedIn: boolean;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  loggedIn: boolean;
}
