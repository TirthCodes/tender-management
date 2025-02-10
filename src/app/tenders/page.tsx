import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Tenders() {
  const tenders = await prisma.tender.findMany({
    select: {
      id: true,
      dtVoucherDate: true,
      stTenderName: true,
      stTenderType: true,
      dcNetPercentage: true,
      stPersonName: true,
      dcLabour: true,
      stLotNo: true,
      stRoughName: true,
      inTotalRoughPcs: true,
      dcTotalRoughCts: true,
      dcRoughSize: true,
      dcRoughPrice: true,
      dcRoughTotal: true,
      dcBidPrice: true,
      dcResultCost: true,
      dcFinalCostPrice: true,
      dcTotalAmount: true,
      dcResultPerCt: true,
      dcFinalBidPrice: true,
      dcResultTotal: true,
      dcFinalTotalAmount: true,
    },
    orderBy: {
      dtVoucherDate: "desc",
    },
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-700">
            Tenders
          </h1>
          <p className="mt-2 text-sm text-gray-700">Manage your tenders.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/tenders/create"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create tender
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700 sm:pl-0 w-fit"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
                  >
                    Rough Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
                  >
                    Cost Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
                  >
                    Result
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700"
                  >
                    Final
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tenders.map((tender) => (
                  <tr key={tender.id} className="bg-white">
                    <td className="max-w-40 truncate whitespace-nowrap py-3 px-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="grid grid-cols-2 gap-4 divide-x divide-gray-400">
                          <div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Voucher Date:
                              </span> */}
                              <span className="text-gray-700">
                                {new Date(
                                  tender.dtVoucherDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Tender Name:
                              </span> */}
                              <span className="text-gray-700">
                                {tender.stTenderName}
                              </span>
                            </div>
                          </div>
                          <div className="pl-4">
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Tender Type:
                              </span> */}
                              <span className="text-gray-700">
                                {tender.stTenderType}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Note %:
                              </span> */}
                              <span className="text-gray-700">
                                {tender.dcNetPercentage
                                  ? String(tender.dcNetPercentage)
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-40 truncate whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div className="flex items-center">
                        <div className="grid grid-cols-2 gap-4 divide-x divide-gray-400">
                          <div className="w-10">
                            <div className="flex gap-2">
                              <span className="text-gray-700">
                                {tender.stLotNo}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-700">
                                Pcs: {tender.inTotalRoughPcs}
                              </span>
                            </div>
                          </div>
                          <div className="pl-4">
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Tender Type:
                              </span> */}
                              <span className="text-gray-700">
                                {tender.stRoughName}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-700">
                                Note %:
                              </span> */}
                              <span className="text-gray-700">
                                Cts: {tender.dcTotalRoughCts
                                  ? String(tender.dcTotalRoughCts)
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-40 truncate whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div className="text-gray-700">
                        Bid: {tender.dcBidPrice ? String(tender.dcBidPrice) : ""}
                      </div>
                      <div className="mt-1 text-gray-700">
                        Total: {tender.dcTotalAmount
                          ? String(tender.dcTotalAmount)
                          : ""}
                      </div>
                    </td>
                    <td className="max-w-40 truncate whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div className="text-gray-700">
                        Cost: {tender.dcResultCost ? String(tender.dcResultCost) : ""}
                      </div>
                      <div className="mt-1 text-gray-700">
                        Result / Ct: {tender.dcResultPerCt
                          ? String(tender.dcResultPerCt)
                          : ""}
                      </div>
                      <div className="mt-1 text-gray-700">
                        Total: {tender.dcResultTotal
                          ? String(tender.dcResultTotal)
                          : ""}
                      </div>
                    </td>
                    <td className="max-w-20 truncate whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                      <div className="text-gray-700">
                        Cost: {tender.dcFinalCostPrice
                          ? String(tender.dcFinalCostPrice)
                          : ""}
                      </div>
                      <div className="mt-1 text-gray-700">
                        Bid: {tender.dcFinalBidPrice
                          ? String(tender.dcFinalBidPrice)
                          : ""}
                      </div>
                      <div className="mt-1 text-gray-700">
                        Total: {tender.dcFinalTotalAmount
                          ? String(tender.dcFinalTotalAmount)
                          : ""}
                      </div>
                    </td>
                    <td className="max-w-40 truncaterelative whitespace-nowrap py-3 px-3 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                        <span className="sr-only">
                          ,{" "}
                          {tender.dtVoucherDate
                            ? new Date(
                                tender.dtVoucherDate
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </a>
                      <a
                        href="#"
                        className="text-red-600 ml-4 hover:text-red-900"
                      >
                        Delete
                        <span className="sr-only">
                          ,{" "}
                          {tender.dtVoucherDate
                            ? new Date(
                                tender.dtVoucherDate
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
