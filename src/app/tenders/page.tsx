import Link from "next/link";

const tenders = [
  {
    dtVoucherDate: "2025-02-09 08:10:42.823",
    stTenderName: "Tender Name",
    stTenderType: "Single Stone",
    dcNotePercentage: 106,

    stLotNo: "FS39",
    stRoughName: "Rough Name",
    inTotalRoughPcs: 10,
    dcTotalRoughCts: 37.78,
    dcRoughPrice: 870.89,
    dcRoughTotal: 872.89,

    dcBidPrice: 8169.51,
    dcTotalAmount: 40520.75,

    dcResultCost: 18000.0,
    dcResultPerCt: 10438.53,
    dcResultTotal: 51775.11,

    dcFinalCostPrice: 17999.0,
    dcFinalBidPrice: 8169.0,
    dcFinalTotalAmount: 40518.24,
  },
  {
    dtVoucherDate: "2025-02-10 08:10:42.823",
    stTenderName: "Tender 2",
    stTenderType: "Type 1",
    dcNotePercentage: 1.2,

    stRoughName: "Rough 1",
    inTotalRoughPcs: 1,
    dcTotalRoughCts: 1.2,
    dcRoughPrice: 1.2,
    dcRoughTotal: 1.2,

    dcBidPrice: 1.2,
    dcTotalAmount: 1.2,

    dcResultCost: 1.2,
    dcResultPerCt: 1.2,
    dcResultTotal: 1.2,

    dcFinalCostPrice: 1.2,
    dcFinalBidPrice: 1.2,
    dcFinalTotalAmount: 1.2,
  },
  {
    dtVoucherDate: "2021-09-03",
    stTenderName: "Tender 3",
    stTenderType: "Type 1",
    dcNotePercentage: 1.2,

    stRoughName: "Rough 1",
    inTotalRoughPcs: 1,
    dcTotalRoughCts: 1.2,
    dcRoughPrice: 1.2,
    dcRoughTotal: 1.2,

    dcBidPrice: 1.2,
    dcTotalAmount: 1.2,

    dcResultCost: 1.2,
    dcResultPerCt: 1.2,
    dcResultTotal: 1.2,

    dcFinalCostPrice: 1.2,
    dcFinalBidPrice: 1.2,
    dcFinalTotalAmount: 1.2,
  },
];

export default function Tenders() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
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
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rough Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Cost Details
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Result
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                  <tr key={tender.dtVoucherDate} className="bg-white">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="grid grid-cols-2 gap-4 divide-x divide-gray-400">
                          <div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-900">
                                Voucher Date:
                              </span> */}
                              <span className="text-gray-500">
                                {new Date(
                                  tender.dtVoucherDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-900">
                                Tender Name:
                              </span> */}
                              <span className="text-gray-500">
                                {tender.stTenderName}
                              </span>
                            </div>
                          </div>
                          <div className="pl-4">
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-900">
                                Tender Type:
                              </span> */}
                              <span className="text-gray-500">
                                {tender.stTenderType}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {/* <span className="font-medium text-gray-900">
                                Note %:
                              </span> */}
                              <span className="text-gray-500">
                                {tender.dcNotePercentage}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="flex divide-x gap-4 divide-gray-400">
                        <div className=" text-gray-500">{tender.stLotNo}</div>
                        <div className="pl-4 text-gray-500">
                          {tender.stRoughName}
                        </div>
                      </div>
                      <div className="flex divide-x gap-4 divide-gray-400">
                        <div className=" text-gray-500">
                          {tender.inTotalRoughPcs}
                        </div>
                        <div className="pl-4 text-gray-500">
                          {tender.dcTotalRoughCts}
                        </div>
                      </div>
                      <div>
                        <div className="mt-1 text-gray-500">
                          {tender.dcRoughPrice}
                        </div>

                        <div className="mt-1 text-gray-500">
                          {tender.dcRoughTotal}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{tender.dcBidPrice}</div>
                      <div className="mt-1 text-gray-500">
                        {tender.dcTotalAmount}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{tender.dcResultCost}</div>
                      <div className="mt-1 text-gray-500">
                        {tender.dcResultPerCt}
                      </div>
                      <div className="mt-1 text-gray-500">
                        {tender.dcResultTotal}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">
                        {tender.dcFinalCostPrice}
                      </div>
                      <div className="mt-1 text-gray-500">
                        {tender.dcFinalBidPrice}
                      </div>
                      <div className="mt-1 text-gray-500">
                        {tender.dcFinalTotalAmount}
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                        <span className="sr-only">
                          , {tender.dtVoucherDate}
                        </span>
                      </a>
                      <a
                        href="#"
                        className="text-red-600 ml-4 hover:text-red-900"
                      >
                        Delete
                        <span className="sr-only">
                          , {tender.dtVoucherDate}
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
