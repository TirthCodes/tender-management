"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

// const types = [
//   { value: "singleStone", label: "Single Stone" },
//   { value: "roughLot", label: "Rough Lot" },
//   { value: "mixLot", label: "Mix Lot" },
// ];

const initialRow = [
  {
    roughPieces: 1,
    roughCarats: 0,
    color: "",
    colorGrade: 0,
    clarity: "",
    flr: "",
    shape: "",
    polishCarats: 0,
    polishPercent: 0,
    depth: 0,
    table: 0,
    ratio: 0,
    labour: 0,
    salePrice: 0,
    saleAmount: 0,
    costPrice: 0,
    costAmount: 0,
    incription: "",
  },
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

const createTenderSchema = z.object({
  voucherDate: z.string(),
  tenderType: z.string(),
  tenderName: z.string().trim().min(2, { message: "Tender name is required!" }),
  notePercent: z.string().trim().min(2, { message: "Note % is required!" }),
  remark: z.string().trim().optional(),
  lotNo: z.string().trim().min(1, { message: "Lot no.is required!" }),
  roughName: z.string().trim().min(2, { message: "Rough name is required!" }),
  roughPcs: z.string().trim().min(1, { message: "Rough pcs is required!" }),
  roughCts: z.string().trim().min(1, { message: "Rough cts is required!" }),
  roughSize: z.string().trim().min(1, { message: "Rough size is required!" }),
  roughPrice: z.string().trim().min(1, { message: "Rough price is required!" }),
  roughTotal: z.string().trim().min(1, { message: "Rough total is required!" }),
  bidPrice: z.string().trim().min(1, { message: "Bid price is required!" }),
  totalAmount: z
    .string()
    .trim()
    .min(1, { message: "Total amount is required!" }),
  resultCost: z.string().trim().min(1, { message: "Result cost is required!" }),
  resultPerCarat: z
    .string()
    .trim()
    .min(1, { message: "Result per carat is required!" }),
  resultTotal: z
    .string()
    .trim()
    .min(1, { message: "Result total is required!" }),
  finalCostPrice: z
    .string()
    .trim()
    .min(1, { message: "Final cost price is required!" }),
  finalBidPrice: z
    .string()
    .trim()
    .min(1, { message: "Final bid price is required!" }),
  finalTotalAmount: z
    .string()
    .trim()
    .min(1, { message: "Final total amount is required!" }),
});

type CreateTenderFormValues = z.infer<typeof createTenderSchema>;

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
  const [items, setItems] = useState(initialRow);
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [values, setValues] = useState("");
  const [date, setDate] = useState<Date>();
  const [colors] = useState(colorOptions);

  useEffect(() => {
    if (date) {
      setValue("voucherDate", date.toLocaleDateString());
      if (errors.voucherDate) {
        setError("voucherDate", {
          message: undefined,
        });
      }
    }
  }, [date]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
    setError,
  } = useForm<CreateTenderFormValues>({
    mode: "onBlur",
    resolver: zodResolver(createTenderSchema),
  });

  // const filteredColors = colorOptions.filter(
  //   (
  //     color // filter the color options
  //   ) => color.stShortName.toLowerCase().includes(value.toLowerCase())
  // );

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <input
            placeholder="Select Color..."
            value={values}
            onChange={(e) => setValues(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-[200px] border rounded-md"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No color found.</CommandEmpty>
              <CommandGroup>
                {colorOptions.map((color) => (
                  <CommandItem
                    key={color.stShortName}
                    value={color.stShortName}
                    onSelect={(currentValue) => {
                      setValues(currentValue === values ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {color.stShortName}
                    <Check
                      className={cn(
                        "ml-auto",
                        values === color.stShortName
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
        type="button"
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

  const handleAddRow = () => {
    setItems([...items, initialRow[0]]);
  };

  async function onSubmit(data: CreateTenderFormValues) {
    console.log(data, "data");
  }

  console.log(errors, "eroor");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tender Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex w-full items-center">
                <Label className="w-[100px] shrink-0">Voucher Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        `${
                          errors.voucherDate?.message && "border border-red-500"
                        }`
                      )}
                    >
                      <CalendarIcon
                        className={`${
                          errors.voucherDate?.message && "text-red-500"
                        }`}
                      />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span
                          className={`${
                            errors.voucherDate?.message && "text-red-500"
                          }`}
                        >
                          Pick a date
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex w-full items-center">
                <Label className="w-[94px] shrink-0">Tender Type</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("tenderType", value);
                    if (errors.tenderType) {
                      setError("tenderType", {
                        message: undefined,
                      });
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.tenderType?.message &&
                        "border border-red-500 text-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="singleStone">Single Stone</SelectItem>
                      <SelectItem value="roughLot">Rough Lot</SelectItem>
                      <SelectItem value="mixLot">Mix Lot</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-full items-center">
                <Label className="w-[100px] shrink-0">Tender Name</Label>
                <Input
                  type="text"
                  {...register("tenderName")}
                  className={cn(
                    errors.tenderName?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="Single Stone Tender"
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <Label className="w-[94px] shrink-0">Note %</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("notePercent")}
                  className={cn(
                    errors.notePercent?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                  placeholder="106"
                />
              </div>
              <div className="col-span-full">
                <div className="flex w-full items-center">
                  <Label className="w-[100px] shrink-0">Remark</Label>
                  <Input
                    type="text"
                    {...register("remark")}
                    className={cn(
                      "w-full",
                      errors.remark?.message && "border border-red-500"
                    )}
                    placeholder="MIX SAWABLE-MAKEABLE YELLOW (AVG - 1.83)"
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
            <div className="grid grid-cols-6 gap-x-3 gap-y-4">
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[88px] shrink-0">Lot No.</Label>
                <Input
                  type="text"
                  {...register("lotNo")}
                  placeholder="FS39"
                  className={cn(
                    errors.lotNo?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[94px] shrink-0">Rough Name</Label>
                <Input
                  type="text"
                  {...register("roughName")}
                  placeholder="Name"
                  className={cn(
                    errors.roughName?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-2">
                <Label className="w-[84px] shrink-0">Rough Pcs.</Label>
                <Input
                  type="number"
                  {...register("roughPcs")}
                  placeholder="4"
                  className={cn(
                    errors.roughPcs?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Cts.</Label>
                <Input
                  type="number"
                  {...register("roughCts")}
                  placeholder="24.4"
                  className={cn(
                    errors.roughCts?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Size</Label>
                <Input
                  {...register("roughSize")}
                  type="number"
                  placeholder="4.96"
                  className={cn(
                    errors.roughSize?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>
              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Price</Label>
                <Input
                  {...register("roughPrice")}
                  type="number"
                  placeholder="243"
                  className={cn(
                    errors.roughPrice?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
              </div>

              <div className="flex w-full items-center col-span-3">
                <Label className="w-[88px] shrink-0">Rough Total</Label>
                <Input
                  {...register("roughTotal")}
                  type="number"
                  placeholder="999"
                  className={cn(
                    errors.roughTotal?.message &&
                      "border border-red-500 placeholder:text-red-500"
                  )}
                />
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
          footer={footer}
          tableStyle={{ marginBottom: "24px", whiteSpace: "nowrap" }}
        >
          <Column
            body={() => watch("lotNo")}
            headerStyle={{ paddingBlock: "1px" }}
            style={{ paddingBlock: "2px" }}
            header="Lot"
          />
          <Column
            field="totalRoughPieces"
            header="Pcs."
            editor={(props) => textEditor(props)}
            style={{ paddingBlock: "2px" }}
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
            body={(_rowData, options) => (
              <Button
                type="button"
                className="bg-red-600"
                size="icon"
                onClick={() => deleteRow(options.rowIndex)}
              >
                <Trash2 />
              </Button>
            )}
            header={() => (
              <Button
                type="button"
                onClick={() => handleAddRow()}
                size="icon"
                className="rounded-full"
              >
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
                  <Input
                    type="number"
                    {...register("bidPrice")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Total Amount</Label>

                  <Input
                    type="number"
                    {...register("totalAmount")}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Cost</Label>
                  <Input
                    type="number"
                    {...register("resultCost")}
                    disabled
                    readOnly
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result / Cts</Label>
                  <Input
                    type="number"
                    {...register("resultPerCarat")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-32">Result Total</Label>
                  <Input
                    type="number"
                    {...register("resultTotal")}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Cost Price</Label>
                  <Input
                    type="number"
                    {...register("finalCostPrice")}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Bid Price</Label>
                  <Input
                    type="number"
                    {...register("finalBidPrice")}
                    placeholder="20000"
                  />
                </div>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label className="w-52">Final Total Amount</Label>
                  <Input
                    type="number"
                    {...register("finalTotalAmount")}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
