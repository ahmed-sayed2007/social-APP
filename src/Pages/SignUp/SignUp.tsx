import { Input, Label } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../Schema/regesterSchema.ts";
import { sendData } from "../../Service/regesterService.ts";
import type { InterfaceRegister } from "../../Interface/interfaceRegister.ts";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InterfaceRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
  });

  const navigate = useNavigate();

  async function submitForm(data: InterfaceRegister) {
    try {
      await sendData(data);
      toast.success("Account created successfully!");
      navigate("/LogIn");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign Up · LinkedPost</title>
      </Helmet>
      <div className="w-full max-w-lg">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1.5">Join LinkedPost and start connecting</p>
          </div>

          <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input className="input-field" id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="error-pill">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="userName" className="text-sm font-medium text-slate-700">
                  Username
                </Label>
                <Input className="input-field" id="userName" placeholder="johndoe" {...register("username")} />
                {errors.username && <p className="error-pill">{errors.username.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input className="input-field" type="email" id="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="error-pill">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                  Date of Birth
                </Label>
                <Input className="input-field" type="date" id="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && <p className="error-pill">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input className="input-field" type="password" id="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="error-pill">{errors.password.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPass" className="text-sm font-medium text-slate-700">
                  Confirm Password
                </Label>
                <Input className="input-field" type="password" id="confirmPass" placeholder="••••••••" {...register("rePassword")} />
                {errors.rePassword && <p className="error-pill">{errors.rePassword.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender" className="text-sm font-medium text-slate-700">
                Gender
              </Label>
              <select className="input-field" id="gender" {...register("gender")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="error-pill">{errors.gender.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6 sm:hidden">
            Already have an account?{" "}
            <Link to="/LogIn" className="text-blue-600 font-semibold hover:text-blue-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
