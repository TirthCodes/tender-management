import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function Tenders() {
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Tender</h1>
      <form className="grid gap-4 grid-cols-tender-form">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Voucher Number</label>
          <input
            name="voucherNumber"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Date</label>
          <input
            name="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Type</label>
          <input
            name="type"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Note Percentage</label>
          <input
            name="notePercentage"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Rough CTS</label>
          <input
            name="roughCts"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Rough Size</label>
          <input
            name="roughSize"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">PnD CTS</label>
          <input
            name="pndCts"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Rough Price</label>
          <input
            name="roughPrice"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Rough Total</label>
          <input
            name="roughTotal"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="col-span-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Tender
        </button>
      </form>
    </div>
  );
}
