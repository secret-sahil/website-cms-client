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
import { ItemsResponse } from "@/types/items";
import { useDeleteItem } from "@/hooks/useItems";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CONFIG from "@/config";

const Cell = ({ data }: { data: ItemsResponse }) => {
  const { mutate, isPending } = useDeleteItem();
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
            <Link href={`/items/update/${data.id}`} className="flex items-center">
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

export const columns: ColumnDef<ItemsResponse>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={`${CONFIG.imagesBaseUrl}/${row.original.image}`}
            alt={row.original.name}
          />
          <AvatarFallback className="rounded-lg">{row.original.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item Type" />,
    cell: ({ row }) => (
      <span className="bg-red-500/80 text-white px-1 rounded-md">{row.original.type}</span>
    ),
  },
  {
    id: "division",
    accessorKey: "division.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Division" />,
    cell: ({ row }) => (
      <span className="bg-green-500/80 text-white px-1 rounded-md">
        {row.original.division.name}
      </span>
    ),
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <span className="bg-yellow-500/80 text-white px-1 rounded-md">
        {row.original?.category?.name}
      </span>
    ),
  },
  {
    id: "subCategory",
    accessorKey: "subCategory.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sub Category" />,
    cell: ({ row }) => (
      <span className="bg-yellow-300/80 text-white px-1 rounded-md">
        {row.original?.subCategory?.name}
      </span>
    ),
  },
  {
    id: "mainUnit",
    accessorKey: "mainUnit.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Main Unit" />,
    cell: ({ row }) => (
      <span className="bg-blue-500/80 text-white px-1 rounded-md">
        {row.original?.mainUnit?.name}
      </span>
    ),
  },
  {
    id: "altUnit",
    accessorKey: "altUnit.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alt Unit" />,
    cell: ({ row }) =>
      row.original?.altUnit?.name && (
        <span className="bg-blue-300/80 text-white px-1 rounded-md">
          {row.original?.altUnit?.name}
        </span>
      ),
  },
  {
    accessorKey: "thresholdQty",
    header: "Theshold Qty",
  },
  {
    accessorKey: "daysToReorder",
    header: "Notification Days",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <span className="flex flex-col items-center gap-x-1">
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}{" "}
        <span className="flex flex-row items-center gap-x-1 w-min bg-blue-500/80 text-white px-1 rounded-md">
          <Clock className="h-3 w-3" />
          {format(new Date(row.getValue("createdAt")), "HH:mm:ss")}
        </span>
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <span className="flex flex-col items-center gap-x-1">
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
