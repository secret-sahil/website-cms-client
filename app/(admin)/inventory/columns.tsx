"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryResponse } from "@/types/inventory";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<InventoryResponse>[] = [
  {
    id: "itemName",
    accessorKey: "itemName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item Name" />,
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item Type" />,
    cell: ({ row }) => (
      <span
        className={`${row.original.type == "RAW" ? "bg-red-500/80" : row.original.type == "CONSUMABLE" ? "bg-yellow-500/80" : "bg-green-500/80"} text-white px-1 rounded-md`}
      >
        {row.original.type}
      </span>
    ),
  },
  {
    id: "division",
    accessorKey: "divisionName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Division Name" />,
    cell: ({ row }) => (
      <span className="bg-violet-500/80 text-white px-1 rounded-md">
        {row.original.divisionName}
      </span>
    ),
  },
  {
    id: "totalQuantity",
    accessorKey: "totalQuantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Quantity" />,
    cell: ({ row }) => {
      const qty = row.original.combinedQuantity;
      return (
        <span>
          {Number.isInteger(qty) ? qty : qty.toFixed(3)} {row.original.mainUnitAlias}
        </span>
      );
    },
  },
  {
    id: "totalQuantityInAltUnit",
    accessorKey: "totalQuantityInAltUnit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Alt Quantity" />,
    cell: ({ row }) => {
      if (row.original.totalQuantityInAltUnit) {
        const qty = row.original.combinedQuantityInAltUnit;
        return (
          <span>
            {Number.isInteger(qty) ? qty : qty?.toFixed(3)}{" "}
            {row.original.altUnitAlias ?? row.original.mainUnitAlias}
          </span>
        );
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button variant={"outline"} className="rounded-md" asChild>
            <Link
              href={{
                pathname: `/inventory/batches/${row.original.itemId}`,
                query: {
                  name: row.original.itemName,
                },
              }}
            >
              View Batches <ChevronRight />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
