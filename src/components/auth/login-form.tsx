"use client";

import { loginAction } from "@/app/(auth)/auth/actions";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState = {
  message: "",
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" name="username" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>
        <Button disabled={pending} type="submit" className="w-full">
          Login
        </Button>
        <p className="text-red-500 text-sm">{state.message}</p>
      </div>
    </form>
  );
}
