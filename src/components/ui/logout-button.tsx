"use client";

import { logoutAction } from "@/app/(auth)/auth/actions";
import { useActionState } from "react";
import { Button } from "./button";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import useEffectAfterMount from "@/hooks/useEffectAfterMount";

const initialState = {
  success: false,
  message: "",
};

export const LogoutButton = () => {
  const [state, action] = useActionState(logoutAction, initialState);

  useEffectAfterMount(() => {
    if (state.message) {
      if(state.success) {
        toast.success(state.message);
        redirect("/auth/login");
      } else {
        toast.error(state.message);
      }
    }
  }, [state])

  return (
    <form action={action}>
      <Button variant="destructive" className={"font-semibold"}>
        Logout
      </Button>
    </form>
  );
};
