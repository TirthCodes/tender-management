"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createUserAction } from "@/app/(auth)/auth/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  message: "",
};

export default function UserForm() {
  const [state, action, pending] = useActionState(
    createUserAction,
    initialState
  );

  return (
    <form action={action} className="grid gap-4 py-4">
      <div className="grid items-start grid-cols-4 gap-4">
        <Label htmlFor="username" className="text-right">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          name="username"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <Select defaultValue="USER" name="role">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {state.message}
      <DialogFooter>
        <Button disabled={pending} type="submit">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
}
