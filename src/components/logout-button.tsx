"use client";

import { logoutAction } from "@/app/(auth)/auth/actions";
import { useActionState } from "react";
import { Button } from "./ui/button";

const initialState = {
  message: "",
};

export const LogoutButton = () => {
  const [state, action] = useActionState(logoutAction, initialState);

  return (
    <form action={action}>
      <Button variant="destructive" className={"font-semibold"}>
        Logout
      </Button>
    </form>
  );
};
