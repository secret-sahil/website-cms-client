"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryEntry } from "@/types/inventory";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<InventoryEntry>[] = [
  {
    id: "storage",
    accessorKey: "storage.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Storage" />,
    cell: ({ row }) => (
      <>
        {row.original?.storage?.name}{" "}
        <span
          className={`${row.original?.storage?.type == "RAW" ? "bg-red-500/80" : row.original?.storage?.type == "CONSUMABLE" ? "bg-yellow-500/80" : "bg-green-500/80"} text-white px-1 rounded-md`}
        >
          {row.original?.storage?.type}
        </span>
      </>
    ),
  },
  {
    id: "type",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Batch Date (Id)" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.original?.createdAt), "yyyy-MM-dd")}{" "}
        <span className="flex flex-row items-center gap-x-1 w-fit bg-muted-foreground text-white px-1 rounded-md">
          {format(new Date(row.original?.createdAt), "hh:mm a")}
        </span>
      </span>
    ),
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => (
      <span
        className={cn(
          row.original.walletQty ? "bg-yellow-500/80" : "bg-green-500/80",
          "text-white px-1 rounded-md"
        )}
      >
        {row.original?.quantity + row.original?.walletQty + row.original?.redeemedQty}{" "}
        {row.original?.item?.mainUnit?.alias}
      </span>
    ),
  },
  {
    id: "conversionFactor",
    accessorKey: "conversionFactor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Conversion Factor" />,
  },
  {
    id: "altquantity",
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alt Quantity" />,
    cell: ({ row }) => {
      return (
        row.original?.item?.altUnit?.alias &&
        `${row.original?.quantity * row.original?.conversionFactor} ${row.original?.item?.altUnit?.alias}`
      );
    },
  },
  {
    id: "lastUpdated",
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.original.updatedAt), "yyyy-MM-dd")}{" "}
        <span className="flex flex-row items-center gap-x-1 w-fit bg-blue-500/80 text-white px-1 rounded-md">
          {format(new Date(row.original.updatedAt), "hh:mm a")}
        </span>
      </span>
    ),
  },
];
