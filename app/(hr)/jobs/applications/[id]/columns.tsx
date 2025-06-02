"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import { Copy, Dot, ExternalLink, MoveRight } from "lucide-react";
import { ApplicationsResponse } from "@/types/applications";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useViewApplication } from "@/hooks/useApplications";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<ApplicationsResponse>[] = [
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

const Cell = ({ data }: { data: ApplicationsResponse }) => {
  const applications = data;
  const { mutate } = useViewApplication();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => mutate({ id: applications.id, isOpened: true })}
          className="relative"
        >
          {!applications.isOpened && (
            <Dot className="absolute stroke-[10px] -right-1.5 -top-1.5 text-yellow-500" />
          )}
          Open <MoveRight className="ml-2" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">Applications Details</DialogTitle>
          <div className="flex flex-row gap-1">
            <p className="text-sm text-muted-foreground border border-border rounded-lg w-fit px-2">
              Submitted on {new Date(applications.createdAt).toLocaleString()}
            </p>
            <p
              className={cn(
                "font-medium capitalize border border-border rounded-lg px-2 w-fit",
                applications.status === "rejected"
                  ? "text-red-500"
                  : applications.status === "hired"
                    ? "text-green-500"
                    : "text-yellow-500"
              )}
            >
              {applications?.status || "-"}
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
          <Detail label="Full Name" value={applications?.fullName} />
          <DetailWithCopy label="Email" value={applications?.email} />
          <DetailWithCopy label="Phone" value={applications?.phone} />
          <DetailWithExternalLink label="LinkedIn Profile" value={applications?.linkedIn} />
          <DetailWithExternalLink label="Resume" value={applications?.resume} />

          <Detail label="Where did you hear about us?" value={applications?.wheredidyouhear} />
        </div>

        {applications?.coverLetter && (
          <div className="mt-0">
            <h4 className="text-sm font-medium">Coverletter</h4>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-line">
              {applications.coverLetter}
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

const DetailWithCopy = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium">
      <Copy
        onClick={() => {
          navigator.clipboard.writeText(value ?? "");
          toast.success("Email copied to clipboard!");
        }}
        className=" inline-block size-3 cursor-pointer mr-1"
      />
      {value}
    </p>
  </div>
);

const DetailWithExternalLink = ({
  label,
  value,
  canCopy = false,
}: {
  label: string;
  value?: string;
  canCopy?: boolean;
}) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    {value && (
      <p className="font-medium">
        {canCopy && (
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(value ?? "");
              toast.success("Email copied to clipboard!");
            }}
            className=" inline-block size-3 cursor-pointer mr-1"
          />
        )}
        <Link href={value} target="_blank">
          <span className="underline text-blue-600 cursor-pointer">
            {value}
            <ExternalLink className="inline-block size-3 cursor-pointer ml-1" />
          </span>
        </Link>
      </p>
    )}
  </div>
);
