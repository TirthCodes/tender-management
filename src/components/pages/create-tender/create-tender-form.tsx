"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckIcon, Plus, PlusCircle, Trash, Trash2 } from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getCurrentSession } from "@/lib/server/session";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AutoComplete } from "primereact/autocomplete";
import { useQuery } from "@tanstack/react-query";
import {
  getClarityOptions,
  getColorOptions,
  getFluorescenceOptions,
  getShapeOptions,
} from "@/services/options";

const tenderTypes = ["Single Stone", "Rough Lot", "Mix Lot", "Multi Lot"];

const defaultOptions = {
  color: [
    "F VID Y",
    "F VID ORANGY Y",
    "F INT Y",
    "1FIY/2FY",
    "F LIT Y",
    "Y Z",
    "F BRSH Y",
    "F BR GR Y",
  ],
  clarity: ["VVS1", "VS1", "VS1(MILKY)"],
  flr: ["N(YU)", "N", "N(YU)", "F"],
  shape: ["CUSHION", "PEAR", "HEART", "RADIANT", ""],
};

const initialPayload = {
  voucherNumber: "FS39",
  tenderName: "Tender 1",
  tenderType: "Single Stone",
  notePercent: "10",
  lotNo: "FS39",
  roughName: "Rough 1",
  totalRoughPieces: 1,
  totalRoughCarats: 3.5,
  roughtSize: 4.96,
  pndCarats: 0,
  roughPrice: 20000,
  roughTotal: 4.96,
  items: [
    {
      roughPieces: 1,
      roughCarats: 4.96,
      color: "F VID Y", // initial value; later you might store the id instead
      colorGrade: 10,
      clarity: "VVS1",
      flr: "N(YU)",
      shape: "HEART",
      polishCarats: 2.5,
      polishPercent: 50.4,
      depth: 55.0,
      table: 58,
      ratio: 0.86,
      sellPrice: 20000,
      costPrice: 18000,
      incription: "RD-2.35",
    },
    {
      roughPieces: 1,
      roughCarats: 4.57,
      color: "F VID Y",
      colorGrade: 10,
      clarity: "VS1",
      flr: "N",
      shape: "PEAR",
      polishCarats: 2.1,
      polishPercent: 45.95,
      depth: 68.0,
      table: 63,
      ratio: 1.55,
      sellPrice: 25000,
      costPrice: 22000,
      incription: "RD-2.00IHR-2.60",
    },
    {
      roughPieces: 1,
      roughCarats: 4.11,
      color: "F VID ORANGY Y",
      colorGrade: 10,
      clarity: "VVS1",
      flr: "N(YU)",
      shape: "CUSHION",
      polishCarats: 2.5,
      polishPercent: 60.83,
      depth: 69.0,
      table: 64,
      ratio: 1.0,
      sellPrice: 20000,
      costPrice: 16782,
      incription: "RD- 1.89 JOVO",
    },
  ],
  bidPrice: 20000,
  totalAmount: 20000,
  resultCost: 18000,
  resultPerCarat: 0.86,
  resultTotal: 18000,
  finalCostPrice: 18000,
  finalBidPrice: 20000,
  finalTotalAmount: 20000,
};

// const colorOptions = [
//   { label: "F VID Y", value: "F VID Y", id: 1 },
//   {
//     label: "F VID ORANGY Y",
//     value: "F VID ORANGY Y",
//     id: 2,
//   },
// ];

interface Option {
  id: number;
  stShortName: string;
}

interface CreateTenderFormProps {
  colorOptions: Option[];
  clarityOptions: Option[];
  fluorescenceOptions: Option[];
  shapeOptions: Option[];
}

export function CreateTenderForm({
  colorOptions,
  clarityOptions,
  fluorescenceOptions,
  shapeOptions,
}: CreateTenderFormProps) {
  // const { user } = await getCurrentSession();

  // if (user === null) {
  //   return redirect("/auth/login");
  // }

  // --- Local state for form inputs ---

  // invalidate the query when you add new data to any option
  const { data: colorsOptions } = useQuery({
    queryKey: ["color-options"],
    queryFn: getColorOptions,
    initialData: colorOptions,
  });

  const { data: claritiesOptions } = useQuery({
    queryKey: ["clarity-options"],
    queryFn: getClarityOptions,
    initialData: clarityOptions,
  });

  const { data: fluorescencesOptions } = useQuery({
    queryKey: ["fluorescence-options"],
    queryFn: getFluorescenceOptions,
    initialData: fluorescenceOptions,
  });

  const { data: shapesOptions } = useQuery({
    queryKey: ["shape-options"],
    queryFn: getShapeOptions,
    initialData: shapeOptions,
  });

  const [payload] = useState(initialPayload);
  const [items, setItems] = useState(initialPayload.items);
  const [colors] = useState(colorOptions);
  const [filteredColors, setFilteredColors] = useState([]);

  const textEditor = (props) => {
    return (
      <Input
        type="text"
        value={props.rowData[props.field]}
        placeholder="Enter text"
        onChange={(e) => onEditorValueChange(props, e.target.value)}
      />
    );
  };

  const onEditorValueChange = (props, value) => {
    const updatedItems = [...items];
    updatedItems[props.rowIndex][props.field] = value;
    setItems(updatedItems);
  };

  const colorEditor = (props) => {
    return (
      <AutoComplete
        value={props.rowData[props.field]}
        suggestions={filteredColors}
        completeMethod={(e) => searchColor(e)}
        field="label"
        dropdown
        forceSelection={false} // allow free text if desired
        onChange={(e) => onEditorValueChange(props, e.value)}
      />
    );
  };

  const searchColor = (event) => {
    const query = event.query;
    let _filteredColors = colors.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    // Option to add a new color.
    _filteredColors.push({ label: "Add New", value: "Add New", id: 0 });
    setFilteredColors(_filteredColors);
  };

  const actionBodyTemplate = (rowData, options) => {
    return (
      <Button
        className="bg-red-600"
        size="icon"
        onClick={() => deleteRow(options.rowIndex)}
      >
        <Trash2 />
      </Button>
    );
  };

  // Remove a row by index.
  const deleteRow = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems);
  };

  const footer = (
    <div className="flex justify-between">
      <div></div>
      <div></div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Pcs</span>
        <span>151</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Carats</span>
        <span>562</span>
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>

      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Pol. Cats.</span>
        <span>5.65</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Pol.%</span>
        <span>202.36</span>
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Sell Price</span>
        <span>6680</span>
      </div>
      <div className="flex items-center gap-1 text-sm">
        <span className="text-neutral-400">Cost Price</span>
        <span>6680</span>
      </div>
      <div></div>
    </div>
  );

  // Add a new row with default empty values (you can prepopulate the lotNo if desired).
  const addRow = () => {
    const newRow = {
      roughPieces: "",
      roughCarats: "",
      color: "",
      colorGrade: "",
      clarity: "",
      flr: "",
      shape: "",
      polishCarats: "",
      polishPercent: "",
      depth: "",
      table: "",
      ratio: "",
      sellPrice: "",
      costPrice: "",
      incription: "",
    };
    setItems([...items, newRow]);
  };

  const [selectedTenderType, setSelectedTenderType] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [tenderName, setTenderName] = useState("");
  const [notePercent, setNotePercent] = useState("");

  const totalSellPrice = items.reduce((acc, item) => acc + item.sellPrice, 0);
  const totalCostPrice = items.reduce((acc, item) => acc + item.costPrice, 0);

  // ((((((items.cost price + 0) * 97%) - 180) * items.polishCarat) % items.roughCarats) - 50) / 106%).fixed(2)

  const bidPrice = 8169.51;

  return (
    <div>
      <div className="grid w-full grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tender Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Voucher Date</Label>
                  <Input
                    type="date"
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Tender Name</Label>
                  <Input
                    type="text"
                    value={tenderName}
                    onChange={(e) => setTenderName(e.target.value)}
                    placeholder="Single Stone Tender"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Tender Type</Label>
                  <Combobox
                    value={selectedTenderType}
                    onChange={(e) => setSelectedTenderType(e.target.value)}
                    onClose={() => setQuery("")}
                  >
                    <div className="relative">
                      <ComboboxInput
                        displayValue={(tender) => tender?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Select tender type"
                        className={clsx(
                          "w-full rounded-lg border bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black",
                          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
                        )}
                      />
                      <ComboboxButton className="group absolute top-2.5 right-2.5">
                        <ChevronDownIcon className="size-4 fill-black group-data-[hover]:fill-black" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions
                      anchor="bottom start"
                      transition
                      className={clsx(
                        "w-52 rounded-xl border border-black/50 bg-white p-1 [--anchor-gap:var(--spacing-1, 16px)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                      )}
                    >
                      {[
                        { id: 1, name: "Single Stone" },
                        { id: 2, name: "Rough Lot" },
                        { id: 3, name: "Multi Lot" },
                        { id: 4, name: "Mix Lot" },
                      ].map((tender) => (
                        <ComboboxOption
                          key={tender.id}
                          value={tender}
                          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-black/10"
                        >
                          <CheckIcon className="invisible size-4 fill-transparent group-data-[selected]:visible" />
                          <div className="text-sm/6 text-black">
                            {tender.name}
                          </div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </Combobox>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Note %</Label>
                  <Input
                    type="number"
                    step="any"
                    value={notePercent}
                    onChange={(e) => setNotePercent(e.target.value)}
                    placeholder="Enter note"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="grid w-full  items-center gap-1.5">
                  <Label>Remark</Label>
                  <Input
                    type="text"
                    value={tenderName}
                    onChange={(e) => setTenderName(e.target.value)}
                    placeholder="MIX SAWABLE-MAKEABLE YELLOW (AVG - 1.83)"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rough Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>LOT NO</Label>
                  <Input type="text" placeholder="FS39" />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Rough Cts.</Label>
                  <Input type="number" placeholder="24.4" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Rough Name</Label>
                  <Input type="text" placeholder="" />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Rough Size</Label>
                  <Input type="number" placeholder="Enter rough size" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Rough Pcs.</Label>
                  <Input type="number" placeholder="Enter rough pcs" />
                </div>

                {/* Pending carat only needed in multi lot */}
                {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>PND Cts.</Label>
                  <Input type="text" placeholder="Enter PND carats" />
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Rough Price</Label>
                <Input type="number" placeholder="Enter rough price" />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Rough Total</Label>
                <Input type="number" placeholder="Enter rough total" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border-x">
        <DataTable
          value={items}
          showGridlines
          editMode="cell"
          scrollable
          resizableColumns
          scrollHeight="401px"
          // rows={3}
          footer={footer}
          tableStyle={{ marginBottom: "24px", whiteSpace: "nowrap" }}
        >
          <Column
            body={() => payload.lotNo}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
            header="Lot"
          />
          <Column
            field="totalRoughPieces"
            header="Pcs."
            editor={(props) => textEditor(props)}
            style={{ width: "20%", paddingBlock: "2px"  }}
            headerStyle={{ paddingBlock: "1px" }}
          ></Column>
          <Column
            field="totalRoughCarats"
            header="Cts."
            style={{ paddingBlock: "2px" }}
            headerStyle={{ paddingBlock: "1px" }}
          ></Column>
          <Column
            field="color"
            header="Color"
            editor={(props) => colorEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="colorGrade"
            header="C.GD"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="clarity"
            header="Clarity"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="flr"
            header="FLR"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="shape"
            header="Shape"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Pol. Cts."
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Pol. %"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Depth"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Table"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Ratio"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Labour"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Sale Price"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Cost Price"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Tops Ammt"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Incription"
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            header={() => (
              <Button size="icon" className="rounded-full">
                <Plus />
              </Button>
            )}
            align={"center"}
            alignHeader={"center"}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          />
        </DataTable>
      </div>

      <div className="grid grid-cols-1 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Cost Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Bid Price</Label>
                  <Input type="number" readOnly disabled value={bidPrice} />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Total Amount</Label>
                  <Input type="number" readOnly disabled />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Cost</Label>
                  <Input type="number" disabled readOnly />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result / Cts</Label>
                  <Input type="number" readOnly disabled />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Total</Label>
                  <Input type="number" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Cost Price</Label>
                  <Input type="number" readOnly disabled />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Bid Price</Label>
                  <Input type="number" />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Total Amount</Label>
                  <Input type="number" readOnly disabled />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
