"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Clock, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { BomsResponse } from "@/types/boms";
import { useDeleteBom } from "@/hooks/useBoms";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

const Cell = ({ data }: { data: BomsResponse }) => {
  const { mutate, isPending } = useDeleteBom();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    document.body.style.pointerEvents = "";
  }, [isAlertOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/boms/update/${data.id}`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => setIsAlertOpen(true)}
            >
              <Ban className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  mutate(data.id);
                  setIsAlertOpen(false);
                }}
                className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<BomsResponse>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    id: "alias",
    accessorKey: "alias",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alias" />,
  },
  {
    id: "finalProduct",
    accessorKey: "finalProduct.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Final Product" />,
    cell: ({ row }) => (
      <span className="bg-orange-500/80 text-white px-1 rounded-md">
        {row.original.finalProduct.name}
      </span>
    ),
  },
  {
    id: "division",
    accessorKey: "division.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Division Name" />,
  },
  {
    id: "itemsRequired",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items Required" />,
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-1">
        {row.original.itemsRequired.map((item) => (
          <span key={item.item.id} className="bg-green-500/80 text-white px-1 rounded-md">
            {item.item.name} ({item.quantity})
          </span>
        ))}
      </span>
    ),
  },
  {
    id: "byProducts",
    header: ({ column }) => <DataTableColumnHeader column={column} title="By Products" />,
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-1">
        {row.original.byProducts.map((item) => (
          <span key={item.item.id} className="bg-green-500/80 text-white px-1 rounded-md">
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
    id: "updatedBy",
    accessorKey: "updatedBy",
    header: "Updated By",
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
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Cell data={row.original} />,
  },
];
