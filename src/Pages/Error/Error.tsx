import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="min-h-screen auth-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-slate-200 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-800 mt-2">Page not found</h1>
      <p className="text-slate-500 text-sm mt-2 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/Home" className="btn-primary mt-8">
        Go to Home
      </Link>
    </div>
  );
}
