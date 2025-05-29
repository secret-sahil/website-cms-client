"use client";
import AdminLayout from "@/components/layout/admin/page";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import React from "react";
import { useGetAllLead } from "@/hooks/useLead";

export default function Page() {
  const { data } = useGetAllLead();
  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Leads",
          href: "/leads",
        },
      ]}
    >
      <div className="px-4">
        <DataTable columns={columns} data={data?.result ? data?.result?.data?.data : []} />
      </div>
    </AdminLayout>
  );
}
