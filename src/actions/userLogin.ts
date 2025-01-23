"use server";

import { z } from "zod";


const userLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

type StateType = {
  success: boolean;
  message: string;
  errors: {
    username: string;
    password: string;
  };
  values: {
    username: string;
    password: string;
  };
}

export function userLogin(_prevState: StateType, formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = userLoginSchema.safeParse(data);

  console.log(parsed, "parsed")

  try {
    
    return {
      success: true,
      message: "Login successful",
      errors: {
        username: "",
        password: "",
      },
      values: {
        username: "",
        password: "",
      },
    };
  } catch (error) {
    return {
      success: true,
      message: error instanceof Error ? error.message : "Something went wrong",
      errors: {
        username: "",
        password: "",
      },
      values: {
        username: "",
        password: "",
      },
    };
  }
}
