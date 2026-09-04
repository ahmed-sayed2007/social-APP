import { Outlet } from "react-router-dom";
import Nav from "../../Components/Nav/Nav.tsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
