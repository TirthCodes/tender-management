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
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

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
          <Link href={"/tenders"}>
            <Button className="font-semibold">Go to Dashboard</Button>
          </Link>
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
      <div className="bg-gray-200 p-4">
        <div className="inline-block bg-white w-full  align-middle">
          <table className="divide-y min-w-full divide-gray-300">
            <thead className="">
              <tr className=" divide-x divide-gray-200">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="divide-x divide-gray-200">
                  <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                    {user.stUsername}
                  </td>
                  <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                    <Badge>{user.stRole}</Badge>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500">
                    <Button variant="secondary" className="border mr-4">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
