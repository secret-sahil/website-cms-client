"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Clock } from "lucide-react";
import { ProductionResponse } from "@/types/production";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<ProductionResponse>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="bg-muted border px-1 rounded-md">PROD-{row.getValue("id")}</span>
    ),
  },
  {
    id: "productionOrderItems",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-1">
        {row.original?.productionItems?.map((item) => (
          <span key={item.item.id} className="bg-blue-100 border border-blue-200 px-1 rounded-md">
            {item.item.name} ({item.quantity})
          </span>
        ))}
      </span>
    ),
  },

  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}{" "}
        <span className="flex flex-row items-center gap-x-1 w-min bg-blue-500/80 text-white px-1 rounded-md">
          <Clock className="h-3 w-3" />
          {format(new Date(row.getValue("createdAt")), "HH:mm:ss")}
        </span>
      </span>
    ),
  },
];
