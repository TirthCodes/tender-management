import { ColumnDef } from "@tanstack/react-table";

export type MainLot = {
  id: number;
  stName: string;
  stShortName: string;
  inSerial: number;
};

export const mainLotColums: ColumnDef<MainLot>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "stName",
    header: "Name",
  },
  {
    accessorKey: "stShortName",
    header: "Short Name",
  },
  {
    accessorKey: "inSerial",
    header: "Serial",
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex gap-2">
        {/* <ColorDialogForm initialData={row.original} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteColor(row.original.id);
            window.location.reload();
          }}
        >
          Delete
        </Button> */}
      </div>
    ),
  },
];