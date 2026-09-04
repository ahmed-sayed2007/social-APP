import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("the name is required")
      .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/, "please enter a valid email")
      .min(3, "please enter your name min from 3 char")
      .max(10, "please your name must be less than 10 char"),
    username: z
      .string()
      .nonempty("the username is required")
      .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/, "please enter a valid name"),
    email: z
      .string()
      .nonempty("the email is required")
      .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "please enter a valid email"),
    dateOfBirth: z
      .string()
      .nonempty("the dateOfBirth is required")
      .refine((dateValue) => {
        const currentYear = new Date().getFullYear();
        const selectedYear = new Date(dateValue).getFullYear();
        const age = currentYear - selectedYear;
        return age >= 18;
      }, "please choose your age mor than or equal 18"),
    gender: z.enum(["female", "male"] as const, { error: "gender is required" }),
    password: z
      .string()
      .nonempty("the password is required")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "please enter a valid password"),
    rePassword: z
      .string()
      .nonempty("the rePassword is required")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "please enter a valid rePassword"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "the password not match",
  });
