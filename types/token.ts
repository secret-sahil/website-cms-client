export interface TokenStore {
  token: string;
  setToken: (token: string) => void;
  removeToken: () => void;
}
