"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { Copy, Dot, MoveRight } from "lucide-react";
import { LeadResponse } from "@/types/lead";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useMarkLeadAsRead } from "@/hooks/useLead";
import { decrypt } from "@/lib/utils";

export const columns: ColumnDef<LeadResponse>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <span className="capitalize">{row.getValue("fullName")}</span>,
  },

  {
    accessorKey: "updatedBy",
    header: "Last Opened By",
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Opened At" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd")}/
        {format(new Date(row.getValue("updatedAt")), "hh:mm a")}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted At" />,
    cell: ({ row }) => (
      <span className="flex flex-row items-center gap-x-1">
        {format(new Date(row.getValue("createdAt")), "yyyy-MM-dd")}/
        {format(new Date(row.getValue("createdAt")), "hh:mm a")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <Cell data={row.original} />,
  },
];

const Cell = ({ data }: { data: LeadResponse }) => {
  const lead = data;
  const { mutate } = useMarkLeadAsRead();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => mutate({ id: lead.id, isOpened: true })} className="relative">
          {!lead.isOpened && (
            <Dot className="absolute stroke-[10px] -right-1.5 -top-1.5 text-yellow-500" />
          )}
          Open <MoveRight className="ml-2" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Lead Details</DialogTitle>
          <p className="text-sm text-muted-foreground border border-border rounded-lg w-fit px-2">
            Submitted on {new Date(lead.createdAt).toLocaleString()}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
          <Detail label="Full Name" value={lead.fullName} />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">
              <Copy
                onClick={() => {
                  navigator.clipboard.writeText(decrypt(lead.email)!);
                  toast.success("Email copied to clipboard!");
                }}
                className=" inline-block size-3 cursor-pointer mr-1"
              />
              {decrypt(lead.email)}
            </p>
          </div>
          <Detail label="Phone" value={decrypt(lead.phone)} />
          <Detail label="Job Title" value={lead.jobTitle} />
          <Detail label="Company" value={decrypt(lead.company)} />
          <Detail label="Company Size" value={lead.companySize} />
          <Detail label="Budget" value={lead.budget ? `$${lead.budget.toLocaleString()}` : "-"} />
          <Detail label="Source" value={lead.source} />
        </div>

        {lead.message && (
          <div className="mt-0">
            <h4 className="text-sm font-medium">Message</h4>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
              {decrypt(lead.message)}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);
