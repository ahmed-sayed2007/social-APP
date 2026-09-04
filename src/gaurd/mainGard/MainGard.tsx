import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function MainGuard({ children }: { children: ReactNode }) {
  if (localStorage.getItem("token") !== null) {
    return children;
  }
  return <Navigate to="/LogIn" />;
}
