"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useQuery } from "@tanstack/react-query";
import {
  getClarityOptions,
  getColorOptions,
  getFluorescenceOptions,
  getShapeOptions,
} from "@/services/options";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const types = [
  { value: "singleStone", label: "Single Stone" },
  { value: "roughLot", label: "Rough Lot" },
  { value: "mixLot", label: "Mix Lot" },
];

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date>();
  const [colors] = useState(colorOptions);

  const filteredColors = colorOptions.filter(
    (
      color // filter the color options
    ) => color.stShortName.toLowerCase().includes(value.toLowerCase())
  );

  const textEditor = (props) => {
    return (
      <Input
        type="text"
        value={props.rowData[props.field]}
        placeholder="Enter text"
        onChange={(e) => onEditorValueChange(props, e.target.value)}
        className="w-full m-0"
      />
    );
  };

  const onEditorValueChange = (props, value) => {
    const updatedItems = [...items];
    updatedItems[props.rowIndex][props.field] = value;
    setItems(updatedItems);
  };

  const allEditor = (props) => {
    return (
      // <AutoComplete
      //   value={props.rowData[props.field]}
      //   suggestions={filteredColors}
      //   completeMethod={(e) => searchColor(e)}
      //   field="label"
      //   dropdown
      //   forceSelection={false} // allow free text if desired
      //   onChange={(e) => onEditorValueChange(props, e.value)}
      // />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <input
            placeholder="Select Color..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-[200px] border rounded-md"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No color found.</CommandEmpty>
              <CommandGroup>
                {filteredColors.map((color) => (
                  <CommandItem
                    key={color.stShortName}
                    value={color.stShortName}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {color.stShortName}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === color.stShortName
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
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
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Voucher Date</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Tender Name</Label>
                  <Input
                    type="text"
                    value={tenderName}
                    onChange={(e) => setTenderName(e.target.value)}
                    placeholder="Single Stone Tender"
                    className="w-[200px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Tender Type</Label>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a tender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="singleStone">
                          Single Stone
                        </SelectItem>
                        <SelectItem value="roughLot">Rough Lot</SelectItem>
                        <SelectItem value="mixLot">Mix Lot</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Note %</Label>
                  <Input
                    type="number"
                    step="any"
                    value={notePercent}
                    onChange={(e) => setNotePercent(e.target.value)}
                    placeholder="Enter note"
                    className="w-[200px]"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Remark</Label>
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
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Lot No.</Label>
                  <Input type="text" placeholder="FS39" />
                </div>

                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Rough Cts.</Label>
                  <Input type="number" placeholder="24.4" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Rough Name</Label>
                  <Input type="text" placeholder="" />
                </div>

                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Rough Size</Label>
                  <Input type="number" placeholder="Enter rough size" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full items-center">
                  <Label className="whitespace-nowrap mr-4">Rough Pcs.</Label>
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
              <div className="flex w-full items-center">
                <Label className="whitespace-nowrap mr-4">Rough Price</Label>
                <Input type="number" placeholder="Enter rough price" />
              </div>

              <div className="flex w-full items-center">
                <Label className="whitespace-nowrap mr-4">Rough Total</Label>
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
            style={{ width: "20%", paddingBlock: "2px" }}
            headerStyle={{ paddingBlock: "1px" }}
          ></Column>
          <Column
            field="totalRoughCarats"
            header="Cts."
            editor={(props) => textEditor(props)}
            style={{ paddingBlock: "2px" }}
            headerStyle={{ paddingBlock: "1px" }}
          ></Column>
          <Column
            field="color"
            header="Color"
            editor={(props) => allEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="colorGrade"
            header="C.GD"
            editor={(props) => textEditor(props)}
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
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Pol. %"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Depth"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Table"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Ratio"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Labour"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Sale Price"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Sale Amount"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Cost Price"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Cost Amount"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Tops Ammt"
            editor={(props) => textEditor(props)}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
          ></Column>
          <Column
            field="po"
            header="Incription"
            editor={(props) => textEditor(props)}
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
