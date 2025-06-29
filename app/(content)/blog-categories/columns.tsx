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
import { Ban, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { CategoriesResponse } from "@/types/categories";
import { useDeleteCategory } from "@/hooks/useCategories";
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

export const columns: ColumnDef<CategoriesResponse>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <>{row.index + 1}</>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="capitalize">{row.getValue("name")}</span>,
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
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}/
        {format(new Date(row.getValue("createdAt")), "hh:mm a")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd")}/
        {format(new Date(row.getValue("updatedAt")), "hh:mm a")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Cell data={row.original} />,
  },
];

const Cell = ({ data }: { data: CategoriesResponse }) => {
  const { mutate, isPending } = useDeleteCategory();
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
            <Link href={`/blog-categories/update/${data.id}`} className="flex items-center">
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

      {/* Delete Alert Dialog */}
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
