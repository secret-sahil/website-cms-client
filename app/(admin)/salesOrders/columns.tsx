"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Clock, Loader2, MoreHorizontal } from "lucide-react";
import { SalesOrdersResponse } from "@/types/salesOrders";
import { useDeleteSalesOrder } from "@/hooks/useSalesOrders";
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
import { cn } from "@/lib/utils";

const Cell = ({ data }: { data: SalesOrdersResponse }) => {
  const { mutate, isPending } = useDeleteSalesOrder();
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
          {/* <DropdownMenuItem asChild>
            <div className={"w-full justify-start"}>
              <X className="mr-2 h-4 w-4" />
              Force Close
            </div>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem asChild>
            <Link href={`/salesOrders/update/${data.id}`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <div
              className={cn("w-full justify-start", buttonVariants({ variant: "destructive" }))}
              onClick={() => setIsAlertOpen(true)}
            >
              <Ban className="mr-2 h-4 w-4" />
              Force Close
            </div>
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

export const columns: ColumnDef<SalesOrdersResponse>[] = [
  {
    id: "voucherNo",
    accessorKey: "voucherNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Voucher No" />,
    cell: ({ row }) => (
      <span className="bg-muted border px-1 rounded-md">{row.original.voucherNo}</span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span
        className={`px-1 rounded-md ${
          row.original.status === "OPEN"
            ? "bg-green-500/80 text-white"
            : row.original.status === "INPROGRESS"
              ? "bg-yellow-500/80 text-white"
              : "bg-red-500/80 text-white"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "salesOrderItems",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-1">
        {row.original?.salesOrderItems?.map((item) => (
          <span key={item.item.id} className="bg-blue-100 border border-blue-200 px-1 rounded-md">
            {item.item.name} ({item.quantity} {item.item.mainUnit?.name} - {item.redeemedQty}{" "}
            {item.item.mainUnit?.name})
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
    cell: ({ row }) => row.original.status !== "CLOSED" && <Cell data={row.original} />,
  },
];
