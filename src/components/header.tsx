"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "./logout-button";
import { Button } from "./ui/button";
import { User } from "@prisma/client";
import Link from "next/link";

const navigation = [
  { name: "Tenders", href: "/tenders" },
  { name: "Colors", href: "/tenders/colors" },
  { name: "Shapes", href: "/tenders/shapes" },
  { name: "Clarity", href: "/tenders/clarity" },
  { name: "Flourescence", href: "/tenders/fluorescence" },
  // { name: "Main Lot", href: "/main-lot" },
];

export default function Header({ user }: { user: User | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky z-[100] top-0 w-full">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-6"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/tenders" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <span className="font-semibold text-xl">Tender</span>
          </Link>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex">
          {user?.stRole === "ADMIN" && (
            <Button className="mr-4">Manage Users</Button>
          )}
          <LogoutButton />
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/tenders" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <span className="font-semibold text-xl">Tender</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="py-6">
                <Button className="mb-4">Manage Users</Button>
                <LogoutButton />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
