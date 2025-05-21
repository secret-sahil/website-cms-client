"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Check, Clock, Loader2, X } from "lucide-react";
import { SalesResponse } from "@/types/sales";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { useUpdateSales } from "@/hooks/useSales";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Cell = ({ data }: { data: SalesResponse }) => {
  const { mutate, isPending } = useUpdateSales();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertOpen2, setIsAlertOpen2] = useState(false);

  useEffect(() => {
    document.body.style.pointerEvents = "";
  }, [isAlertOpen]);

  return (
    <>
      <div className="flex flex-row items-center gap-x-2">
        <Button onClick={() => setIsAlertOpen2(true)} variant={"success"}>
          Approve <Check />
        </Button>
        <Button onClick={() => setIsAlertOpen(true)} variant={"destructive"}>
          Reject <X />
        </Button>
      </div>

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
                  mutate({ id: data.id, status: "REJECTED" });
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

      {/* Alert Dialog 2 */}
      <AlertDialog open={isAlertOpen2} onOpenChange={setIsAlertOpen2}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kindly verify before approving!</AlertDialogTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2">#</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.salesItems?.map((item, index) => (
                  <TableRow key={item.item.id}>
                    <TableCell className="w-2">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.item.name}</TableCell>
                    <TableCell>
                      {item.quantity} {item.item.mainUnit.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="success"
                onClick={() => {
                  mutate({ id: data.id, status: "APPROVED" });
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

export const columns: ColumnDef<SalesResponse>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => (
      <span className="bg-muted border px-1 rounded-md">SALE-{row.getValue("id")}</span>
    ),
  },
  {
    id: "voucherNo",
    accessorKey: "salesOrder.voucherNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sale Order" />,
    cell: ({ row }) =>
      row.original.salesOrder?.voucherNo ? (
        <span className="bg-blue-500/80  text-white px-1 rounded-md">
          {row.original.salesOrder?.voucherNo}
        </span>
      ) : (
        <span
          className={`${cn(row.original?.status === "NEED_APPROVAL" ? "bg-yellow-500/80" : row.original?.status === "REJECTED" ? "bg-red-500/80" : "bg-blue-500/80")}  text-white px-1 rounded-md`}
        >
          SO/{row.original.party?.name}
        </span>
      ),
  },
  {
    id: "salesOrderItems",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-1">
        {row.original?.salesItems?.map((item) => (
          <span key={item.item.id} className="bg-blue-100 border border-blue-200 px-1 rounded-md">
            {item.item.name} ({item.quantity})
          </span>
        ))}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClasses = {
        APPROVED: "bg-green-500/80 text-white",
        REJECTED: "bg-red-500/80 text-white",
        NEED_APPROVAL: "bg-yellow-500/80 text-white",
      };
      return <span className={`${statusClasses[status!]} px-1 rounded-md`}>{status}</span>;
    },
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => row.original?.status === "NEED_APPROVAL" && <Cell data={row.original} />,
  },
];
