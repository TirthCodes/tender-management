"use client";

import { userLogin } from "@/actions/userLogin";
import React, { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(userLogin, {
    success: false,
    message: "",
    errors: {
      username: "",
      password: "",
    },
    values: {
      username: "",
      password: "",
    }
  })

  return (
    <div>Form</div>
  )
}