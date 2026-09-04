import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
type tokenContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};

export const tokenContext = createContext<tokenContextType | null>(null);
export function TokenContwxtProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(()=>{
    return localStorage.getItem("token")
  });

  return <tokenContext.Provider value={{ token, setToken }}>{children}</tokenContext.Provider>;
}
