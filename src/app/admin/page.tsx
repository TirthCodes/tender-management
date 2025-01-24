import UserForm from "@/components/user-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { LogoutButton } from "@/components/logout-button";

export default async function Admin() {
  const { user } = await getCurrentSession();

  if (user?.stRole !== "ADMIN") {
    return redirect("/tenders");
  }

  const users = await prisma.user.findMany();

  return (
    <div className="flex flex-col gap-8 m-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold tracking-tighter text-3xl">All Users</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="font-semibold">+ Create New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Create a new user with the given details.
                </DialogDescription>
              </DialogHeader>
              <UserForm />
            </DialogContent>
          </Dialog>
          <LogoutButton />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className=" bg-gray-100 hover:bg-gray-100">
              <TableHead className="font-semibold px-4 capitalize">
                Username
              </TableHead>
              <TableHead className="font-semibold px-4 capitalize">
                Role
              </TableHead>
              <TableHead className="font-semibold px-4 capitalize">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium px-4">
                  {user.stUsername}
                </TableCell>
                <TableCell className="px-4 ">
                  <Badge
                    className={`px-3 py-1 rounded-full
                  `}
                  >
                    {user.stRole}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2 px-4 justify-end">
                  <Button variant="outline" className="hover:bg-gray-100">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
