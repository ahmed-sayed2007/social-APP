import { Link, Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/LogIn";

  return (
    <div className="auth-bg min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
            <span className="text-white font-bold text-lg leading-none">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LinkedPost
          </span>
        </Link>
        <p className="text-sm text-slate-500 hidden sm:block">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={isLogin ? "/" : "/LogIn"}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        © 2026 LinkedPost · Connect with professionals
      </footer>
    </div>
  );
}
