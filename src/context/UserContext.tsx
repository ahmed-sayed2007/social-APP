import { createContext, useContext, type ReactNode } from "react";
import type { UserInterface } from "../Interface/InterfaceUser.ts";

import axios from "axios";
import { BaseUrl } from "../Const/BaseUrl.ts";
import { useQuery } from "@tanstack/react-query";
import { tokenContext } from "./tokenContwxtProvider.tsx";

export const userContext = createContext<UserInterface | null>(null);

function UserContextProvider({ children }: { children: ReactNode }) {
  // const token = localStorage.getItem("token");
  const auth = useContext(tokenContext);
  if (!auth) {
    throw new Error("No auth context available");
  }
  const { token } = auth;
  const getUserProfile = () =>
    axios.get(`${BaseUrl}/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  const { data: user, isError } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserProfile,
    enabled: !!token,
    select: (response) => response?.data.data.user,
  });

  if (isError) {
    throw new Error("there is an error");
  }

  return <userContext.Provider value={user ?? null}>{children}</userContext.Provider>;
}

export default UserContextProvider;
