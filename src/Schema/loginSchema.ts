import * as z from "zod";

export const loginSchema = z
  .object({
 
    email: z
      .string()
      .nonempty("the email is required")
      .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "please enter a valid email"),
  
    password: z
      .string()
      .nonempty("the password is required")
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "please enter a valid password"),
  })
  