import { Input, Label } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendDataLogin } from "../../Service/loginService.ts";
import type { InterfaceLogin } from "../../Interface/interfaceRegister.ts";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../Schema/loginSchema.ts";
import { useContext } from "react";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { Helmet } from "react-helmet";

export default function LogIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterfaceLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const navigate = useNavigate();
  const auth = useContext(tokenContext);
  if (!auth) throw new Error("the token is null");
  const { setToken } = auth;

  async function submitLogin(userData: InterfaceLogin) {
    try {
      const result = await sendDataLogin(userData);
      localStorage.setItem("token", result.data.token);
      setToken(result.data.token);
      toast.success("Welcome back!");
      navigate("/Home");
    } catch {
      toast.error("Invalid email or password");
    }
  }

  return (
    <>
      <Helmet>
        <title>Log In · LinkedPost</title>
      </Helmet>
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to your LinkedPost account</p>
          </div>

          <form onSubmit={handleSubmit(submitLogin)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                className="input-field"
                type="email"
                id="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && <p className="error-pill">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                className="input-field"
                type="password"
                id="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && <p className="error-pill">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 sm:hidden">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
